import { useCallback, useMemo, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown as markdownLanguage } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import {
  Columns2,
  Download,
  Eye,
  FileDown,
  FileText,
  FileUp,
  PanelLeft,
  Save,
} from 'lucide-react'
import 'highlight.js/styles/github-dark.css'
import './App.css'

type LayoutMode = 'split' | 'editor' | 'preview'

function App() {
  const [markdown, setMarkdown] = useState('')
  const [fileName, setFileName] = useState('untitled.md')
  const [filePath, setFilePath] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split')
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('Ready')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLElement>(null)

  const editorExtensions = useMemo(
    () => [markdownLanguage(), EditorView.lineWrapping],
    [],
  )

  const desktopApi = window.desktopApi
  const documentState = isDirty ? 'Unsaved' : 'Saved'

  const setDocument = useCallback((content: string, name: string, path?: string | null) => {
    setMarkdown(content)
    setFileName(name)
    setFilePath(path ?? null)
    setIsDirty(false)
    setStatus(`Opened ${name}`)
  }, [])

  const handleOpen = async () => {
    if (desktopApi) {
      const result = await desktopApi.openMarkdown()

      if (result) {
        setDocument(result.content, result.fileName, result.filePath)
      }

      return
    }

    fileInputRef.current?.click()
  }

  const handlePickedFile = async (file: File) => {
    const content = await file.text()
    const localPath = (file as File & { path?: string }).path
    setDocument(content, file.name, localPath)
  }

  const handleSave = async () => {
    if (desktopApi) {
      const result = await desktopApi.saveMarkdown({
        content: markdown,
        filePath,
        fileName,
      })

      if (result) {
        setFileName(result.fileName)
        setFilePath(result.filePath)
        setIsDirty(false)
        setStatus(`Saved ${result.fileName}`)
      }

      return
    }

    downloadText(fileName, markdown, 'text/markdown')
    setIsDirty(false)
    setStatus(`Downloaded ${fileName}`)
  }

  const handleSaveAs = async () => {
    if (desktopApi) {
      const result = await desktopApi.saveMarkdownAs({
        content: markdown,
        fileName,
      })

      if (result) {
        setFileName(result.fileName)
        setFilePath(result.filePath)
        setIsDirty(false)
        setStatus(`Saved ${result.fileName}`)
      }

      return
    }

    downloadText(fileName, markdown, 'text/markdown')
    setIsDirty(false)
    setStatus(`Downloaded ${fileName}`)
  }

  const handleExportHtml = async () => {
    const previewHtml = previewRef.current?.innerHTML ?? ''
    const htmlName = getExportFileName(fileName, 'html')
    const fullHtml = buildExportHtml(fileName, previewHtml)

    if (desktopApi) {
      const result = await desktopApi.exportHtml({
        html: fullHtml,
        fileName: htmlName,
      })

      if (result) {
        setStatus(`Exported ${result.fileName}`)
      }

      return
    }

    downloadText(htmlName, fullHtml, 'text/html')
    setStatus(`Downloaded ${htmlName}`)
  }

  const handleExportPdf = async () => {
    const previewHtml = previewRef.current?.innerHTML ?? ''
    const pdfName = getExportFileName(fileName, 'pdf')
    const fullHtml = buildExportHtml(fileName, previewHtml)

    if (desktopApi) {
      const result = await desktopApi.exportPdf({
        html: fullHtml,
        fileName: pdfName,
      })

      if (result) {
        setStatus(`Exported ${result.fileName}`)
      }

      return
    }

    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(fullHtml)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      setStatus('Opened print dialog')
    }
  }

  const handleMarkdownChange = (value: string) => {
    setMarkdown(value)
    setIsDirty(true)
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]

    if (!file) {
      return
    }

    await handlePickedFile(file)
  }

  const layoutClass = `workspace workspace--${layoutMode}`

  return (
    <main
      className={`app-shell${isDragging ? ' app-shell--dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <header className="toolbar">
        <div className="document-meta">
          <div className="document-icon" aria-hidden="true">
            <FileText size={18} />
          </div>
          <div>
            <h1>Markdown Styled Preview</h1>
            <p>{fileName}</p>
          </div>
        </div>

        <div className="toolbar-actions" aria-label="Document actions">
          <button type="button" onClick={handleOpen} title="Open Markdown">
            <FileUp size={16} />
            <span>Open</span>
          </button>
          <button type="button" onClick={handleSave} title="Save Markdown">
            <Save size={16} />
            <span>Save</span>
          </button>
          <button type="button" onClick={handleSaveAs} title="Save Markdown As">
            <Save size={16} />
            <span>Save As</span>
          </button>
          <button type="button" onClick={handleExportHtml} title="Export HTML">
            <Download size={16} />
            <span>HTML</span>
          </button>
          <button type="button" onClick={handleExportPdf} title="Export PDF">
            <FileDown size={16} />
            <span>PDF</span>
          </button>
        </div>

        <div className="layout-toggle" aria-label="Layout">
          <button
            type="button"
            className={layoutMode === 'editor' ? 'active' : ''}
            onClick={() => setLayoutMode('editor')}
            title="Editor only"
          >
            <PanelLeft size={16} />
          </button>
          <button
            type="button"
            className={layoutMode === 'split' ? 'active' : ''}
            onClick={() => setLayoutMode('split')}
            title="Split view"
          >
            <Columns2 size={16} />
          </button>
          <button
            type="button"
            className={layoutMode === 'preview' ? 'active' : ''}
            onClick={() => setLayoutMode('preview')}
            title="Preview only"
          >
            <Eye size={16} />
          </button>
        </div>
      </header>

      <input
        ref={fileInputRef}
        className="hidden-file-input"
        type="file"
        accept=".md,.markdown,.mdown,.txt,text/markdown,text/plain"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            void handlePickedFile(file)
          }
          event.currentTarget.value = ''
        }}
      />

      <section className={layoutClass}>
        <section className="pane editor-pane" aria-label="Markdown editor">
          <div className="pane-header">
            <span>Markdown</span>
            <span>{documentState}</span>
          </div>
          <CodeMirror
            value={markdown}
            height="100%"
            theme={oneDark}
            extensions={editorExtensions}
            basicSetup={{
              bracketMatching: true,
              closeBrackets: true,
              defaultKeymap: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              lineNumbers: true,
            }}
            onChange={handleMarkdownChange}
          />
        </section>

        <section className="pane preview-pane" aria-label="Styled preview">
          <div className="pane-header">
            <span>Preview</span>
            <span>{status}</span>
          </div>
          <article ref={previewRef} className="markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
          </article>
        </section>
      </section>

      <footer className="status-bar">
        <span>{filePath ?? 'Local draft'}</span>
        <span>{markdown.length.toLocaleString()} chars</span>
      </footer>
    </main>
  )
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function buildExportHtml(title: string, previewHtml: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>${exportStyles}</style>
</head>
<body>
  <main class="markdown-preview">${previewHtml}</main>
</body>
</html>`
}

function getExportFileName(fileName: string, extension: 'html' | 'pdf') {
  const nextName = fileName.replace(/\.(md|markdown|mdown|txt|html|pdf)$/i, `.${extension}`)

  return nextName === fileName ? `${fileName}.${extension}` : nextName
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const exportStyles = `
@page {
  size: A4;
  margin: 18mm;
}
:root {
  color: #d5d8df;
  background: #1d1f23;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
body {
  margin: 0;
  background: #1d1f23;
}
.markdown-preview {
  box-sizing: border-box;
  max-width: 980px;
  min-height: 100%;
  margin: 0 auto;
  padding: 56px 40px 72px;
  color: #d5d8df;
  line-height: 1.68;
}
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  color: #f0f2f6;
  line-height: 1.22;
}
.markdown-preview h1 {
  margin: 0 0 10px;
  font-size: 34px;
}
.markdown-preview h2 {
  margin: 52px 0 18px;
  font-size: 26px;
}
.markdown-preview h3 {
  margin: 36px 0 14px;
  font-size: 18px;
}
.markdown-preview p,
.markdown-preview li {
  font-size: 15px;
}
.markdown-preview ul,
.markdown-preview ol {
  padding-left: 26px;
}
.markdown-preview pre {
  overflow-x: auto;
  margin: 16px 0 24px;
  padding: 18px 20px;
  background: #303339;
}
.markdown-preview code {
  font-family: "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 13px;
}
.markdown-preview :not(pre) > code {
  padding: 2px 6px;
  border-radius: 4px;
  background: #2c3036;
}
.markdown-preview blockquote {
  margin: 24px 0;
  padding-left: 18px;
  border-left: 3px solid #5daeea;
  color: #aeb4bf;
}
.markdown-preview table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}
.markdown-preview th,
.markdown-preview td {
  padding: 10px 12px;
  border: 1px solid #3b4048;
}
.markdown-preview th {
  background: #2b2f35;
}
@media print {
  body {
    background: #1d1f23;
  }
  .markdown-preview {
    max-width: none;
    padding: 0;
  }
}
`

export default App
