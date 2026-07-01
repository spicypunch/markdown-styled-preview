const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')

const devServerUrl = process.env.VITE_DEV_SERVER_URL

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 940,
    minHeight: 620,
    backgroundColor: '#191b1f',
    title: 'Markdown Styled Preview',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('markdown:open', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const filePath = result.filePaths[0]
  const content = await fs.readFile(filePath, 'utf8')

  return {
    content,
    filePath,
    fileName: path.basename(filePath),
  }
})

ipcMain.handle('markdown:save', async (_event, payload) => {
  const hasTarget = typeof payload.filePath === 'string' && payload.filePath.length > 0
  const filePath = hasTarget ? payload.filePath : await pickSavePath('document.md')

  if (!filePath) {
    return null
  }

  await fs.writeFile(filePath, payload.content, 'utf8')

  return {
    filePath,
    fileName: path.basename(filePath),
  }
})

ipcMain.handle('markdown:saveAs', async (_event, payload) => {
  const filePath = await pickSavePath(payload.fileName || 'document.md')

  if (!filePath) {
    return null
  }

  await fs.writeFile(filePath, payload.content, 'utf8')

  return {
    filePath,
    fileName: path.basename(filePath),
  }
})

ipcMain.handle('markdown:exportHtml', async (_event, payload) => {
  const filePath = await pickExportPath(payload.fileName || 'document.html')

  if (!filePath) {
    return null
  }

  await fs.writeFile(filePath, payload.html, 'utf8')

  return {
    filePath,
    fileName: path.basename(filePath),
  }
})

ipcMain.handle('markdown:exportPdf', async (_event, payload) => {
  const filePath = await pickPdfPath(payload.fileName || 'document.pdf')

  if (!filePath) {
    return null
  }

  const tempDir = await fs.mkdtemp(path.join(app.getPath('temp'), 'markdown-styled-preview-'))
  const tempHtmlPath = path.join(tempDir, 'preview.html')
  const backgroundColor = getExportBackgroundColor(payload.html)
  const pdfWindow = new BrowserWindow({
    width: 1000,
    height: 1400,
    show: false,
    backgroundColor,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  try {
    await fs.writeFile(tempHtmlPath, payload.html, 'utf8')
    await pdfWindow.loadFile(tempHtmlPath)
    await waitForFonts(pdfWindow)

    const pdfData = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: {
        marginType: 'default',
      },
    })

    await fs.writeFile(filePath, pdfData)

    return {
      filePath,
      fileName: path.basename(filePath),
    }
  } finally {
    if (!pdfWindow.isDestroyed()) {
      pdfWindow.destroy()
    }

    await fs.rm(tempDir, { recursive: true, force: true })
  }
})

async function pickSavePath(defaultPath) {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  return result.canceled ? null : result.filePath
}

async function pickExportPath(defaultPath) {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'HTML', extensions: ['html'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  return result.canceled ? null : result.filePath
}

async function pickPdfPath(defaultPath) {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  return result.canceled ? null : result.filePath
}

async function waitForFonts(window) {
  await window.webContents
    .executeJavaScript(
      "document.fonts ? document.fonts.ready.then(() => true).catch(() => true) : true",
    )
    .catch(() => true)
  await new Promise((resolve) => setTimeout(resolve, 250))
}

function getExportBackgroundColor(html) {
  return /<body\b[^>]*\bdata-theme=["']light["']/i.test(html) ? '#ffffff' : '#1d1f23'
}
