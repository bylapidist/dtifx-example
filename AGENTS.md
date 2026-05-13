# Agent Guidelines

> **This file is for AI coding agents (Claude, Copilot, etc.), not human contributors.**
> Human contributors should follow [CONTRIBUTING.md](CONTRIBUTING.md) instead.

- Use the DTIFx CLI and official configs as-is; avoid custom wrappers or re-implementations of toolkit behavior.
- Keep Node.js version requirements aligned between `.nvmrc`, `package.json`, and any documentation references.
- When editing Markdown, retain the single-line bullet style with two-space indented sub-bullets and finish files with a trailing newline.
- Use "artefact" (UK spelling) throughout — not "artifact".
- Use `pnpm run` in all command examples — not `npm run`.
- Update contributor-facing docs (`README.md`, `CONTRIBUTING.md`) whenever commands, quality gates, or artifact locations change.
- Ensure committed artifacts under `ops/artifacts/` are regenerated with the current CLI so they reflect the latest token state.
- After editing token files, always restart the kernel: `pnpm run kernel:stop && pnpm run kernel:start`.
