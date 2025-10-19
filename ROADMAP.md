# DTIFx Minimal Implementation Roadmap

## Reference Materials

- DTIFx Toolkit documentation hub: https://dtifx.lapidist.net/
- DTIF specification reference: https://github.com/bylapidist/dtif
- DTIF CLI workflows: https://dtifx.lapidist.net/docs/cli/workflows
- DTIF build configuration guide: https://dtifx.lapidist.net/docs/build/configuration
- DTIF diff workflow overview: https://dtifx.lapidist.net/docs/diff/overview
- DTIF audit policies: https://dtifx.lapidist.net/docs/audit/overview
- Design-lint documentation hub: https://design-lint.lapidist.net/

---

## Phase 0 – Foundation

1. **Align toolchain**
   - Pin Node.js 22.20.0 in `.nvmrc`, `package.json`, and onboarding notes; verify `npm --version` meets the engine constraint.
   - Install dependencies with `npm install` so the local `node_modules/.bin/dtifx` command is available for scripts and CI runners.
   - Configure ESLint, Prettier, and design-lint with minimal rule sets; add npm scripts (`lint`, `format`, `design-lint`, `verify`) wired to the official tool commands.
2. **Prepare repository structure**
   - Create `tokens/` for DTIF documents, `build/`, `diff/`, and `audit/` for CLI configs, and `ops/artifacts/` for generated evidence.
   - Document the entry points in `README.md` and `CONTRIBUTING.md`, emphasizing the minimal workflow and CLI-first approach.

## Phase 1 – Token Authoring

1. **Seed DTIF documents**
   - Author the consolidated bundle in `tokens/index.dtif.json` with valid metadata and governance annotations aligned to the DTIF specification.
   - Capture component styling and theme overrides inside the same document so a single artifact represents the current design contract.
2. **Enforce authoring quality**
   - Run `npm run design-lint` to validate the configuration and tokens with the design-lint CLI, keeping the minimal rule set aligned with the DTIF authoring model.
   - Use `npm run dtif:validate` to confirm schema compliance before committing updates; capture validation logs under `ops/artifacts/validate/`.

## Phase 2 – Build Pipeline

1. **Configure build outputs**
   - Define `build/dtif-build.config.mjs` to emit a registry JSON, human-readable manifest, and CSS variable file into `ops/artifacts/build/` using the DTIF build CLI.
   - Document the build command (`npm run dtif:build`) in `README.md` along with expectations for reviewing generated artefacts.
2. **Establish baselines**
   - Store an initial DTIF bundle snapshot at `ops/artifacts/diff/baseline.dtif.json` produced from a vetted token document.
   - Use the CLI to compare `ops/artifacts/diff/baseline.dtif.json` with `tokens/index.dtif.json` (`npm run dtif:diff`) so `ops/artifacts/diff/report.{json,md}` reflect the review-ready change summary.

## Phase 3 – Audit & Governance

1. **Define audit policies**
   - Capture minimal accessibility and ownership requirements in `audit/dtif-audit.config.mjs`, focusing on error-level rules that protect critical metadata.
   - Record expectations in `SECURITY.md`, clarifying how audit findings should be triaged.
2. **Automate evidence capture**
   - Execute `npm run dtif:audit` to populate `ops/artifacts/audit/` with JSON and Markdown reports via the bundled CLI wrapper; ensure artefacts are committed for traceability.
   - Update `ops/README.md` to describe where build, diff, validation, and audit evidence lives and how reviewers should interpret the files.

## Phase 4 – Ongoing Operations

1. **Streamline contributor workflow**
   - Keep `CONTRIBUTING.md` focused on running `npm install`, `npm run verify`, and the DTIF CLI commands; reference troubleshooting steps via official docs when necessary.
   - Provide guidance on refreshing diff baselines and audit outputs when token changes are intentional.
   - Maintain GitHub Actions workflow `.github/workflows/ci.yml` so every push and pull request runs the verify, validate, build, diff, and audit scripts with Node.js 22.20.0.
2. **Release checklist**
   - Before tagging a release, rerun `npm run verify`, `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit`; confirm artefacts are updated and pass CI gates.
   - Track remaining enhancements (additional components, platform exports, automation) in GitHub issues rather than expanding this roadmap to preserve the minimal scope.
