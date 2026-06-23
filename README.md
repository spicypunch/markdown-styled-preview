# Markdown Styled Preview

Desktop Markdown editor with a live styled preview panel.

## Scripts

```bash
npm run electron:dev
```

Runs the Vite dev server and opens the Electron app.

```bash
npm run build
npm run electron
```

Builds the renderer and opens the desktop app from `dist`.

```bash
npm run package:mac
```

Builds a signed local macOS app bundle at `release/mac-arm64/Markdown Styled Preview.app`.

```bash
npm run smoke:visual
```

Captures a visual smoke-test screenshot into `.artifacts/preview.png`.

## Features

- Open `.md`, `.markdown`, `.mdown`, or `.txt` files.
- Edit Markdown with CodeMirror.
- Preview GitHub-flavored Markdown with dark documentation styling.
- Save, Save As, and export rendered HTML.
- Switch between editor, split, and preview-only layouts.
