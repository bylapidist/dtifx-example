# Contributing

## Workflow

- Keep pull requests tightly scoped and describe which DTIF documents or UI assets changed.
- Run `pnpm install` followed by `pnpm run verify` before opening a pull request so ESLint and `design-lint "src/**/*.{css,js,jsx,ts,tsx}"` both succeed.
- Include the results of `pnpm run dtif:build`, `pnpm run dtif:diff`, and `pnpm run dtif:audit` in your PR description when tokens change so reviewers can inspect artefacts under `ops/artifacts/`; the diff command writes JSON evidence, normalizes source URIs to `file:///workspace/dtifx-example`, and streams the console reporter, while the audit command emits sanitized JSON and Markdown output via the CLI reporters.
- The GitHub Actions workflow `.github/workflows/ci.yml` runs the verify, validate, build, diff, and audit commands on every push and pull request; ensure your branch passes the pipeline before requesting review.

## Development environment

- Use Node.js 24 (see `.nvmrc`) and pnpm 10 or later.
- The DTIFx CLI is installed locally via `pnpm install`; use the provided pnpm scripts instead of global commands.
- Start the DSR kernel before linting: `pnpm run kernel:start`. The kernel must be running for `design-lint` to report token violations.
- Reference the official documentation at https://dtifx.lapidist.net/ and https://design-lint.lapidist.net/ if you encounter CLI-specific issues.

## Documentation style

- Keep Markdown bullet items on a single line and indent sub-bullets with two spaces to match repository conventions.
- Update `README.md` and `ops/README.md` when workflows or artefact locations change.

## Pull request checklist

- [ ] `pnpm run verify` passes locally.
- [ ] `pnpm run dtif:build`, `pnpm run dtif:diff`, and `pnpm run dtif:audit` outputs have been reviewed and committed when applicable.
- [ ] Documentation has been updated to reflect any workflow changes.
