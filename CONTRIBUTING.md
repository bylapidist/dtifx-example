# Contributing

## Workflow

- Follow the phases outlined in `ROADMAP.md`; keep pull requests scoped to one roadmap item whenever possible.
- Run `npm install` followed by `npm run verify` before opening a pull request so ESLint and `design-lint lint "tokens/**/*.dtif.json"` both succeed.
- Include the results of `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` in your PR description when tokens change so reviewers can inspect artefacts under `ops/artifacts/`; the audit script already captures sanitized JSON and Markdown output from the CLI.
- The GitHub Actions workflow `.github/workflows/ci.yml` runs the verify, validate, build, diff, and audit commands on every push and pull request; ensure your branch passes the pipeline before requesting review.

## Development environment

- Use Node.js 22.20.0 (see `.nvmrc`) and npm 10 or later.
- The DTIFx CLI is installed locally via `npm install`; use the provided npm scripts instead of global commands.
- Reference the official documentation at https://dtifx.lapidist.net/ and https://design-lint.lapidist.net/ if you encounter CLI-specific issues.

## Documentation style

- Keep Markdown bullet items on a single line and indent sub-bullets with two spaces to match repository conventions.
- Update `README.md` and `ops/README.md` when workflows or artefact locations change.

## Pull request checklist

- [ ] `npm run verify` passes locally.
- [ ] `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` outputs have been reviewed and committed when applicable.
- [ ] Documentation has been updated to reflect any workflow changes.
