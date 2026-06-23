const { app, BrowserWindow } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')

const artifactDir = path.join(__dirname, '../.artifacts')
const pdfPath = path.join(artifactDir, 'preview-smoke.pdf')

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 18mm; }
    body {
      margin: 0;
      background: #1d1f23;
      color: #d5d8df;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main { line-height: 1.68; }
    h1 { color: #f0f2f6; font-size: 34px; margin: 0 0 10px; }
    pre { padding: 18px 20px; background: #303339; }
  </style>
</head>
<body>
  <main>
    <h1>PDF Smoke Test</h1>
    <p>Markdown preview output should render into a valid PDF.</p>
    <pre><code>flutter pub get</code></pre>
  </main>
</body>
</html>`

app.disableHardwareAcceleration()

app
  .whenReady()
  .then(async () => {
    const window = new BrowserWindow({
      width: 1000,
      height: 1400,
      show: false,
      backgroundColor: '#1d1f23',
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    await fs.mkdir(artifactDir, { recursive: true })
    const tempDir = await fs.mkdtemp(path.join(app.getPath('temp'), 'markdown-styled-preview-pdf-'))
    const htmlPath = path.join(tempDir, 'preview.html')

    try {
      await fs.writeFile(htmlPath, html, 'utf8')
      await window.loadFile(htmlPath)
      await window.webContents
        .executeJavaScript(
          "document.fonts ? document.fonts.ready.then(() => true).catch(() => true) : true",
        )
        .catch(() => true)

      const pdfData = await window.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        margins: {
          marginType: 'default',
        },
      })

      await fs.writeFile(pdfPath, pdfData)

      const signature = pdfData.subarray(0, 4).toString('utf8')
      const failures = []

      if (signature !== '%PDF') failures.push('PDF signature missing')
      if (pdfData.byteLength < 1000) failures.push('PDF output is unexpectedly small')

      console.log(
        JSON.stringify(
          {
            pdfPath,
            byteLength: pdfData.byteLength,
            signature,
            failures,
          },
          null,
          2,
        ),
      )

      if (failures.length > 0) {
        process.exitCode = 1
      }
    } finally {
      if (!window.isDestroyed()) {
        window.destroy()
      }

      await fs.rm(tempDir, { recursive: true, force: true })
      app.quit()
    }
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
    app.quit()
  })
