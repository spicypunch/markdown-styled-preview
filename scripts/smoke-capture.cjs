const { app, BrowserWindow } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')

const targetUrl = process.env.TARGET_URL || 'http://127.0.0.1:5173'
const artifactDir = path.join(__dirname, '../.artifacts')
const screenshotPath = path.join(artifactDir, 'preview.png')

app.disableHardwareAcceleration()

app
  .whenReady()
  .then(async () => {
    const window = new BrowserWindow({
      width: 1440,
      height: 900,
      show: false,
      backgroundColor: '#191b1f',
      webPreferences: {
        offscreen: true,
      },
    })

    await window.loadURL(targetUrl)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const initialMetrics = await window.webContents.executeJavaScript(`
      (() => {
        const workspace = document.querySelector('.workspace')
        const editor = document.querySelector('.editor-pane')
        const preview = document.querySelector('.preview-pane')
        const previewArticle = document.querySelector('.markdown-preview')
        const toolbarButtons = document.querySelectorAll('.toolbar button')
        const editorRect = editor?.getBoundingClientRect()
        const previewRect = preview?.getBoundingClientRect()

        return {
          hasWorkspace: Boolean(workspace),
          hasEditor: Boolean(editor),
          hasPreview: Boolean(preview),
          editorWidth: Math.round(editorRect?.width ?? 0),
          previewWidth: Math.round(previewRect?.width ?? 0),
          toolbarButtons: toolbarButtons.length,
          previewTextLength: previewArticle?.textContent?.trim().length ?? -1,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        }
      })()
    `)

    const longMarkdown = Array.from(
      { length: 120 },
      (_, index) => `## Scroll section ${index + 1}\\n\\n- Long preview line ${index + 1}\\n`,
    ).join('\\n')

    await window.webContents.executeJavaScript(`
      (() => {
        const content = document.querySelector('.cm-content')
        content?.focus()
      })()
    `)
    await window.webContents.insertText(longMarkdown)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const scrollMetrics = await window.webContents.executeJavaScript(`
      (() => {
        const editorScroller = document.querySelector('.cm-scroller')
        const previewArticle = document.querySelector('.markdown-preview')

        if (editorScroller) {
          editorScroller.scrollTop = editorScroller.scrollHeight
        }

        if (previewArticle) {
          previewArticle.scrollTop = previewArticle.scrollHeight
        }

        return {
          editorClientHeight: Math.round(editorScroller?.clientHeight ?? 0),
          editorScrollHeight: Math.round(editorScroller?.scrollHeight ?? 0),
          editorScrollTop: Math.round(editorScroller?.scrollTop ?? 0),
          previewClientHeight: Math.round(previewArticle?.clientHeight ?? 0),
          previewScrollHeight: Math.round(previewArticle?.scrollHeight ?? 0),
          previewScrollTop: Math.round(previewArticle?.scrollTop ?? 0),
        }
      })()
    `)

    await fs.mkdir(artifactDir, { recursive: true })
    const screenshot = await window.webContents.capturePage()
    await fs.writeFile(screenshotPath, screenshot.toPNG())

    const failures = []
    if (!initialMetrics.hasWorkspace) failures.push('missing workspace')
    if (initialMetrics.editorWidth < 320) failures.push('editor pane too narrow')
    if (initialMetrics.previewWidth < 320) failures.push('preview pane too narrow')
    if (initialMetrics.toolbarButtons < 7) failures.push('toolbar controls missing')
    if (initialMetrics.previewTextLength !== 0) failures.push('initial preview is not blank')
    if (initialMetrics.horizontalOverflow) failures.push('document overflows horizontally')
    if (scrollMetrics.editorScrollHeight <= scrollMetrics.editorClientHeight) {
      failures.push('editor does not have a scrollable area')
    }
    if (scrollMetrics.editorScrollTop <= 0) failures.push('editor scrollTop did not move')
    if (scrollMetrics.previewScrollHeight <= scrollMetrics.previewClientHeight) {
      failures.push('preview does not have a scrollable area')
    }
    if (scrollMetrics.previewScrollTop <= 0) failures.push('preview scrollTop did not move')

    console.log(
      JSON.stringify(
        {
          targetUrl,
          screenshotPath,
          initialMetrics,
          scrollMetrics,
          failures,
        },
        null,
        2,
      ),
    )

    if (failures.length > 0) {
      process.exitCode = 1
    }

    app.quit()
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
    app.quit()
  })
