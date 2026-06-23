const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopApi', {
  openMarkdown: () => ipcRenderer.invoke('markdown:open'),
  saveMarkdown: (payload) => ipcRenderer.invoke('markdown:save', payload),
  saveMarkdownAs: (payload) => ipcRenderer.invoke('markdown:saveAs', payload),
  exportHtml: (payload) => ipcRenderer.invoke('markdown:exportHtml', payload),
  exportPdf: (payload) => ipcRenderer.invoke('markdown:exportPdf', payload),
})
