# Markdown Styled Preview 한국어 안내

[English](README.md)

Markdown 문서를 작성하고, 오른쪽 미리보기 화면으로 확인한 뒤, HTML이나 PDF로 저장할 수 있는 데스크탑 앱입니다.

앱을 실행하면 빈 문서로 시작합니다. 왼쪽에는 Markdown 원문을 작성하고, 오른쪽에는 선택한 테마가 적용된 미리보기가 표시됩니다. README, 프로젝트 문서, 설치 가이드, 라이브러리 목록, 개발 노트처럼 공유 전에 보기 좋게 확인해야 하는 문서에 맞춰 만들었습니다.

## 주요 기능

- Markdown 편집기와 스타일 미리보기를 동시에 보는 split view.
- `.md`, `.markdown`, `.mdown`, `.txt` 파일 열기.
- Markdown 파일 저장 및 다른 이름으로 저장.
- 오른쪽 미리보기 화면을 HTML로 저장.
- 오른쪽 미리보기 화면을 PDF로 저장.
- Light/Dark 테마 선택.
- 편집기 전용, split view, 미리보기 전용 레이아웃 전환.
- 로컬 Markdown 파일 드래그 앤 드롭 지원.
- 표, 리스트, 코드 블록, inline code 등 GitHub-flavored Markdown 지원.

## 시작하기

### 앱 다운로드

일반 사용자는 [Releases](https://github.com/spicypunch/markdown-styled-preview/releases) 페이지에서 최신 macOS zip 파일을 내려받으면 됩니다.

zip 파일을 푼 뒤 `Markdown Styled Preview.app`을 Applications 폴더로 옮기거나 원하는 로컬 폴더에서 실행할 수 있습니다.

현재 앱은 Apple notarization을 거치지 않았습니다. macOS에서는 처음 실행할 때 앱을 우클릭한 뒤 `Open`을 선택해야 할 수 있습니다.

### 소스에서 실행하기

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

배포용 zip 파일을 만들려면 다음 명령을 실행합니다.

```bash
npm run dist:mac
```

## 문서 내보내기

앱 상단 툴바에서 사용할 수 있습니다.

- `Open`: 기존 Markdown 파일 열기.
- `Save`: 현재 Markdown 파일 저장.
- `Save As`: 다른 이름으로 저장.
- `HTML`: 오른쪽 미리보기 화면을 HTML 문서로 저장.
- `PDF`: 오른쪽 미리보기 화면을 PDF 문서로 저장.
- Sun/Moon 버튼: Light/Dark 테마 전환.

HTML과 PDF는 Markdown 원문이 아니라 오른쪽 viewer에 렌더링된 결과를 기준으로 저장됩니다. 저장 결과에는 현재 선택한 테마가 적용됩니다.

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

## 릴리스 배포하기

로컬에서 macOS zip 파일을 빌드합니다.

```bash
npm run dist:mac
```

버전 태그를 만들고 push합니다.

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Release를 만들고 로컬 zip 파일을 업로드합니다.

```bash
gh release create v0.1.0 "release/Markdown Styled Preview-0.1.0-arm64-mac.zip" --title "v0.1.0" --notes "Initial macOS release."
```

이미 있는 Release의 파일을 교체하려면 다음 명령을 사용합니다.

```bash
gh release upload v0.1.0 "release/Markdown Styled Preview-0.1.0-arm64-mac.zip" --clobber
```

## 사용 기술

- Electron
- React
- TypeScript
- Vite
- CodeMirror
- react-markdown
- remark-gfm
- rehype-highlight

## 기여하기

기여를 환영합니다. 로컬 개발과 Pull Request 기준은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 라이선스

Markdown Styled Preview는 [MIT License](LICENSE)로 배포됩니다.
