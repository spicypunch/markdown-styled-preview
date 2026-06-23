export type OpenMarkdownResult = {
  content: string
  filePath: string
  fileName: string
}

export type SaveMarkdownPayload = {
  content: string
  filePath?: string | null
  fileName?: string
}

export type SaveMarkdownResult = {
  filePath: string
  fileName: string
}

export type ExportRenderedPayload = {
  html: string
  fileName?: string
}

declare global {
  interface Window {
    desktopApi?: {
      openMarkdown: () => Promise<OpenMarkdownResult | null>
      saveMarkdown: (payload: SaveMarkdownPayload) => Promise<SaveMarkdownResult | null>
      saveMarkdownAs: (payload: SaveMarkdownPayload) => Promise<SaveMarkdownResult | null>
      exportHtml: (payload: ExportRenderedPayload) => Promise<SaveMarkdownResult | null>
      exportPdf: (payload: ExportRenderedPayload) => Promise<SaveMarkdownResult | null>
    }
  }
}

export {}
