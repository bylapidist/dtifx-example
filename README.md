# DTIFx Minimal Stack Example

This repository demonstrates a canonical, production-ready setup of the DTIFx Toolkit paired with design-lint for validating CSS and React usage against the published token catalogue.

## Repository layout

- Tokens: `tokens/` stores the DTIF documents (`foundations.dtif.json`, `components/*.dtif.json`, `themes/*.dtif.json`, `index.dtif.json`) that feed the CLI.
- Sample UI usage: `src/components/` contains a React example and stylesheet checked by design-lint to illustrate consuming the generated tokens.
- Artefacts: `ops/artifacts/` captures outputs from DTIF build, diff, audit, and validation commands committed for review.
- Tooling config: `build/`, `audit/`, `design-lint.config.cjs`, and `eslint.config.js` configure the official CLI workflows without custom wrappers.

## Prerequisites

1. Install Node.js 22.20.0 (`nvm use`).
2. Run `npm install` to fetch the DTIFx CLI, design-lint, and linting dependencies.

## Core commands

- `npm run dtif:validate`: Runs `dtifx build validate` against `build/dtif-build.config.mjs` to ensure all DTIF sources compile.
- `npm run dtif:build`: Executes `dtifx build generate` and writes CSS/JSON outputs to `ops/artifacts/build/`.
- `npm run dtif:diff`: Compares `tokens/index.dtif.json` to the committed baseline via `dtifx diff compare`, emitting JSON and Markdown evidence.
- `npm run dtif:audit`: Runs `dtifx audit run --reporter json --reporter markdown --config audit/dtif-audit.config.mjs --out-dir ops/artifacts/audit` to evaluate governance policies and commit JSON/Markdown evidence.
- `npm run design-lint`: Invokes `design-lint lint "src/**/*.{css,js,jsx,ts,tsx}" --config design-lint.config.cjs` to verify the example UI honours the canonical tokens.
- `npm run verify`: Convenience script that runs ESLint followed by the design-lint command.

Commit refreshed artefacts after DTIF sources change so reviewers can diff the generated evidence alongside code changes.

## Continuous integration

- GitHub Actions workflow `.github/workflows/ci.yml` installs dependencies with `npm ci` on Node.js 22.20.0 and runs `npm run verify`, `npm run dtif:validate`, `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` on every push and pull request.

## Reference documentation

- DTIFx Toolkit: https://dtifx.lapidist.net/
- design-lint: https://design-lint.lapidist.net/

## Contributing and support

- Review `CONTRIBUTING.md` for workflow expectations aligned with this minimal stack.
- See `SECURITY.md` for vulnerability disclosure and hardening guidelines.
