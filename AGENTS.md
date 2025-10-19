# Agent Guidelines
- Use the DTIFx CLI and official configs as-is; avoid custom wrappers or re-implementations of toolkit behavior.
- Keep Node.js version requirements aligned between `.nvmrc`, `package.json`, and any documentation references.
- When editing Markdown, retain the single-line bullet style with two-space indented sub-bullets and finish files with a trailing newline.
- Update contributor-facing docs (`README.md`, `CONTRIBUTING.md`) whenever commands, quality gates, or artefact locations change.
- Ensure committed artefacts under `ops/artifacts/` are regenerated with the current CLI so they reflect the latest token state.
