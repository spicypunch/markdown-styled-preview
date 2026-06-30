# Markdown Styled Preview

[한국어](README.ko.md)

A desktop Markdown editor for writing, previewing, and exporting styled documentation.

Markdown Styled Preview opens with a clean blank document, shows your Markdown source on the left, and renders a polished themed preview on the right. It is built for README files, project notes, installation guides, library lists, and other developer-facing documents that should look good before they are shared.

## Features

- Live split view with a Markdown editor and styled preview.
- Open `.md`, `.markdown`, `.mdown`, and `.txt` files.
- Save and Save As for Markdown documents.
- Export the rendered preview as HTML.
- Export the rendered preview as PDF.
- Choose between light and dark themes.
- Switch between editor-only, split, and preview-only layouts.
- Drag and drop local Markdown files into the app.
- GitHub-flavored Markdown support, including tables, lists, code blocks, and inline code.

## Getting Started

### Download the App

For regular use, download the latest macOS zip file from the [Releases](https://github.com/spicypunch/markdown-styled-preview/releases) page.

After unzipping the file, move `Markdown Styled Preview.app` to your Applications folder or run it from any local folder.

This app is currently not notarized by Apple. On macOS, you may need to right-click the app and choose `Open` the first time.

### Build from Source

Clone the repository and install dependencies:

```bash
git clone https://github.com/spicypunch/markdown-styled-preview.git
cd markdown-styled-preview
npm install
```

Run the desktop app in development mode:

```bash
npm run electron:dev
```

Build and run the production renderer locally:

```bash
npm run build
npm run electron
```

## Build a macOS App

To create a local macOS `.app` bundle:

```bash
npm run package:mac
```

The app bundle is created at:

```text
release/mac-arm64/Markdown Styled Preview.app
```

This build uses local ad-hoc signing so it can run on your Mac. It is not notarized for public macOS distribution.

To create a distributable zip file:

```bash
npm run dist:mac
```

## Exporting Documents

Use the toolbar buttons in the app:

- `Open`: open an existing Markdown file.
- `Save`: save the current Markdown file.
- `Save As`: save the current Markdown as a new file.
- `HTML`: export the rendered preview as an HTML document.
- `PDF`: export the rendered preview as a PDF document.
- Sun/Moon buttons: switch between light and dark themes.

The HTML and PDF exports are based on the viewer output, not the raw Markdown source. Exports use the currently selected theme.

## Development Scripts

```bash
npm run lint
```

Runs ESLint.

```bash
npm run build
```

Builds the React renderer with Vite.

```bash
npm run smoke:visual
```

Runs an Electron smoke test for layout, scrolling, and preview rendering.

```bash
npm run smoke:pdf
```

Runs an Electron smoke test that generates a PDF file.

## Publishing a Release

Build the macOS zip locally:

```bash
npm run dist:mac
```

Create and push a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Create a GitHub Release and upload the local zip:

```bash
gh release create v0.1.0 "release/Markdown Styled Preview-0.1.0-arm64-mac.zip" --title "v0.1.0" --notes "Initial macOS release."
```

To replace the file on an existing release:

```bash
gh release upload v0.1.0 "release/Markdown Styled Preview-0.1.0-arm64-mac.zip" --clobber
```

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- CodeMirror
- react-markdown
- remark-gfm
- rehype-highlight

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for local development and pull request guidelines.

## License

Markdown Styled Preview is released under the [MIT License](LICENSE).
