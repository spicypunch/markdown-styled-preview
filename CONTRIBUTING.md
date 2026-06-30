# Contributing

Thanks for taking the time to improve Markdown Styled Preview.

## Local Development

```bash
npm install
npm run electron:dev
```

## Before Opening a Pull Request

Run the checks that match your change:

```bash
npm run lint
npm run build
npm run smoke:visual
npm run smoke:pdf
```

For UI changes, include a short note about what you verified manually.

## Pull Request Guidelines

- Keep changes focused and reviewable.
- Update the README when user-facing behavior changes.
- Do not commit generated folders such as `dist`, `release`, `.artifacts`, `.npm-cache`, or `node_modules`.
- Explain the user impact of the change in the PR description.

## Release Notes

If a change affects app packaging, exports, file handling, or platform support, mention it explicitly in the release notes.
