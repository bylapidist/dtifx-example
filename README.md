# DTIFx Minimal Stack Example

This repository demonstrates a streamlined, production-ready DTIFx Toolkit setup focused on token authoring, validation, build, diff, and audit workflows with minimal glue code.

- Roadmap: `ROADMAP.md` captures the phased delivery plan tailored to this slim implementation.
- Tokens: `tokens/index.dtif.json` contains the consolidated DTIF bundle consumed by the DTIF CLI.
- Artefacts: `ops/artifacts/` stores build outputs, diff evidence, validation logs, and audit reports created by the official tooling.

## Getting Started

1. Install Node.js 22.20.0 (`nvm use`).
2. Run `npm install` to fetch the DTIFx CLI, design-lint, and formatting dependencies.
3. Validate the DTIF sources with `npm run dtif:validate`; any schema errors will stop the workflow.
4. Execute `npm run dtif:build` to generate CSS and JSON outputs under `ops/artifacts/build/`.
5. Capture or refresh the baseline registry with `npm run dtif:diff` after reviewing the generated build output.
6. Evaluate governance policies using `npm run dtif:audit`; the helper script shells out to the DTIF CLI, filters runtime logs, and writes JSON/Markdown reports into `ops/artifacts/audit/`.
7. Run `npm run verify` to execute ESLint and the `design-lint validate` check in one step, ensuring the configuration and tokens remain compliant.

Refer to the DTIFx documentation at https://dtifx.lapidist.net/ and the design-lint guidance at https://design-lint.lapidist.net/ for full CLI usage details.

## Continuous Integration

- GitHub Actions workflow `.github/workflows/ci.yml` installs dependencies with `npm ci` on Node.js 22.20.0 and runs `npm run verify`, `npm run dtif:validate`, `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` on every push and pull request.

## Contributing and Support

- Review `CONTRIBUTING.md` for workflow expectations aligned with this minimal stack.
- See `SECURITY.md` for vulnerability disclosure and hardening guidelines.
