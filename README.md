# Markdown Styled Preview

A desktop Markdown editor for writing, previewing, and exporting styled documentation.

Markdown Styled Preview opens with a clean blank document, shows your Markdown source on the left, and renders a polished dark-theme preview on the right. It is built for README files, project notes, installation guides, library lists, and other developer-facing documents that should look good before they are shared.

## Features

- Live split view with a Markdown editor and styled preview.
- Open `.md`, `.markdown`, `.mdown`, and `.txt` files.
- Save and Save As for Markdown documents.
- Export the rendered preview as HTML.
- Export the rendered preview as PDF.
- Switch between editor-only, split, and preview-only layouts.
- Drag and drop local Markdown files into the app.
- GitHub-flavored Markdown support, including tables, lists, code blocks, and inline code.

## Getting Started

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

## Exporting Documents

Use the toolbar buttons in the app:

- `Open`: open an existing Markdown file.
- `Save`: save the current Markdown file.
- `Save As`: save the current Markdown as a new file.
- `HTML`: export the rendered preview as an HTML document.
- `PDF`: export the rendered preview as a PDF document.

The HTML and PDF exports are based on the viewer output, not the raw Markdown source.

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

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- CodeMirror
- react-markdown
- remark-gfm
- rehype-highlight

---

# Markdown Styled Preview 한국어 안내

Markdown 문서를 작성하고, 오른쪽 미리보기 화면으로 확인한 뒤, HTML이나 PDF로 저장할 수 있는 데스크탑 앱입니다.

앱을 실행하면 빈 문서로 시작합니다. 왼쪽에는 Markdown 원문을 작성하고, 오른쪽에는 스타일이 적용된 다크 테마 미리보기가 표시됩니다. README, 프로젝트 문서, 설치 가이드, 라이브러리 목록, 개발 노트처럼 공유 전에 보기 좋게 확인해야 하는 문서에 맞춰 만들었습니다.

## 주요 기능

- Markdown 편집기와 스타일 미리보기를 동시에 보는 split view.
- `.md`, `.markdown`, `.mdown`, `.txt` 파일 열기.
- Markdown 파일 저장 및 다른 이름으로 저장.
- 오른쪽 미리보기 화면을 HTML로 저장.
- 오른쪽 미리보기 화면을 PDF로 저장.
- 편집기 전용, split view, 미리보기 전용 레이아웃 전환.
- 로컬 Markdown 파일 드래그 앤 드롭 지원.
- 표, 리스트, 코드 블록, inline code 등 GitHub-flavored Markdown 지원.

## 시작하기

저장소를 clone하고 의존성을 설치합니다.

```bash
git clone https://github.com/spicypunch/markdown-styled-preview.git
cd markdown-styled-preview
npm install
```

개발 모드로 데스크탑 앱을 실행합니다.

```bash
npm run electron:dev
```

프로덕션 렌더러를 빌드한 뒤 로컬에서 실행합니다.

```bash
npm run build
npm run electron
```

## macOS 앱 만들기

로컬 macOS `.app` 번들을 만들려면 다음 명령을 실행합니다.

```bash
npm run package:mac
```

앱 번들은 아래 경로에 생성됩니다.

```text
release/mac-arm64/Markdown Styled Preview.app
```

이 빌드는 내 Mac에서 실행할 수 있도록 로컬 ad-hoc 서명을 사용합니다. 공개 배포용 notarization은 포함되어 있지 않습니다.

## 문서 내보내기

앱 상단 툴바에서 사용할 수 있습니다.

- `Open`: 기존 Markdown 파일 열기.
- `Save`: 현재 Markdown 파일 저장.
- `Save As`: 다른 이름으로 저장.
- `HTML`: 오른쪽 미리보기 화면을 HTML 문서로 저장.
- `PDF`: 오른쪽 미리보기 화면을 PDF 문서로 저장.

HTML과 PDF는 Markdown 원문이 아니라 오른쪽 viewer에 렌더링된 결과를 기준으로 저장됩니다.

## 개발 스크립트

```bash
npm run lint
```

ESLint를 실행합니다.

```bash
npm run build
```

Vite로 React 렌더러를 빌드합니다.

```bash
npm run smoke:visual
```

Electron 환경에서 레이아웃, 스크롤, 미리보기 렌더링을 확인합니다.

```bash
npm run smoke:pdf
```

Electron 환경에서 PDF 생성이 정상 동작하는지 확인합니다.

## 사용 기술

- Electron
- React
- TypeScript
- Vite
- CodeMirror
- react-markdown
- remark-gfm
- rehype-highlight
