# DTIFx Minimal Stack Example

This repository demonstrates a canonical, production-ready setup of the DTIFx Toolkit paired with design-lint for validating CSS and React usage against the published token catalogue.

## Repository layout

- Tokens: `tokens/` stores the DTIF documents (`foundations.json`, `components/*.json`, `themes/*.json`, `catalog.json`) that feed the CLI.
- Sample UI usage: `src/components/` contains a React example and stylesheet checked by design-lint to illustrate consuming the generated tokens.
- Artefacts: `ops/artifacts/` captures outputs from DTIF build, diff, audit, and validation commands committed for review (see [`ops/artifacts/README.md`](ops/artifacts/README.md)).
- Tooling config: `build/`, `audit/`, `design-lint.config.cjs`, and `eslint.config.js` configure the official CLI workflows without custom wrappers.

## Prerequisites

1. Install Node.js 22.21.0 (`nvm use`).
2. Run `npm install` to fetch the DTIFx CLI, design-lint, and linting dependencies.

## Quick start

1. Clone the repository and install dependencies: `git clone https://github.com/bylapidist/dtifx-example.git && cd dtifx-example && npm install` (see the [DTIFx setup overview](https://github.com/bylapidist/dtifx/blob/main/docs/overview/index.md)).
2. Run `npm run verify` to execute ESLint followed by design-lint; expect both tools to exit cleanly, mirroring the default gate enforced in [`CONTRIBUTING.md`](CONTRIBUTING.md).
3. Validate the DTIF catalogue with `npm run dtif:validate`; expect `dtifx build validate` to finish without errors, and when you need persistent evidence capture the CLI output under `ops/artifacts/validate/` as described in [`ops/artifacts/validate/README.md`](ops/artifacts/validate/README.md) and the [CLI validation guide](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md).
4. Generate token outputs with `dtifx build generate --config build/dtif-build.config.mjs` (the command behind `npm run dtif:build`); the CLI writes `tokens.css` and `tokens.json` to `ops/artifacts/build/` for review alongside the [DTIF build reference](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md).
5. Run `dtifx diff compare ops/artifacts/diff/baseline.dtif.json tokens/catalog.json --format json --output ops/artifacts/diff/report.json` followed by the same invocation with `--format markdown --output ops/artifacts/diff/report.md` (mirrored by `npm run dtif:diff`) to compare against the baseline and capture both evidence formats. Replace `baseline.dtif.json` with the newly approved snapshot as described in [`ops/artifacts/diff/README.md`](ops/artifacts/diff/README.md) and the [diff comparison docs](https://github.com/bylapidist/dtifx/blob/main/docs/diff/index.md). When metadata-only churn appears (for example, file URI changes), inspect the JSON evidence to understand what changed and decide whether to refresh the baseline.
6. Audit governance policies with `npm run dtif:audit` and inspect the JSON/Markdown reports in `ops/artifacts/audit/` per the [audit command reference](https://github.com/bylapidist/dtifx/blob/main/docs/audit/index.md).
7. Lint the sample UI with `npm run design-lint`; confirm the terminal reports zero violations and consult the [design-lint usage guide](https://design-lint.lapidist.net/).

## Core commands

- `dtifx build validate --config build/dtif-build.config.mjs` (surfaced via `npm run dtif:validate`): Ensures all DTIF sources compile.
- `dtifx build generate --config build/dtif-build.config.mjs` (surfaced via `npm run dtif:build`): Refreshes `ops/artifacts/build/tokens.{css,json}` as defined by the config.
- `dtifx diff compare ops/artifacts/diff/baseline.dtif.json tokens/catalog.json --format json --output ops/artifacts/diff/report.json` and `--format markdown --output ops/artifacts/diff/report.md` (surfaced via `npm run dtif:diff`): Produces JSON/Markdown evidence comparing the bundle to the approved baseline.
- `dtifx audit run --reporter json --reporter markdown --config audit/dtif-audit.config.mjs --out-dir ops/artifacts/audit` (surfaced via `npm run dtif:audit`): Evaluates governance policies and commits JSON/Markdown evidence.
- `design-lint lint "src/**/*.{css,js,jsx,ts,tsx}" --config design-lint.config.cjs` (surfaced via `npm run design-lint`): Verifies the example UI honours the canonical tokens.
- `npm run verify`: Convenience script that runs ESLint followed by the design-lint command.

Commit refreshed artefacts after DTIF sources change so reviewers can diff the generated evidence alongside code changes.

## UI token usage example

The sample `Button` component consumes the generated CSS variables directly from `ops/artifacts/build/tokens.css`, demonstrating how product teams wire DTIF outputs into React code.

```jsx
// src/components/Button.jsx
import './button.css';

export function Button({ children = 'Primary action', emphasize = false, onClick }) {
  const className = emphasize ? 'button-primary button-primary--emphasize' : 'button-primary';

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
/* src/components/button.css */
@import '../../ops/artifacts/build/tokens.css';

.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--foundations-spacing-md);
  padding-block: var(--catalog-cmp-btn-pad);
  padding-inline: var(--foundations-spacing-lg);
  font-weight: var(--catalog-weight-var-semibold, 600);
  border: none;
  cursor: pointer;
  background-color: var(--catalog-cmp-btn-bg);
  color: var(--catalog-cmp-btn-fg);
  transition: background-color var(--catalog-duration-vars-btn, 120ms) ease-in-out;
}

.button-primary:hover,
.button-primary:focus-visible {
  background-color: var(--catalog-cmp-btn-bg-hover);
}

.button-primary--emphasize {
  padding-block: var(--catalog-cmp-btn-pad);
  padding-inline: var(--foundations-spacing-lg);
}
```

The transition definition surfaces the shared duration token, while the hover/focus rule references the variant background colour override so readers can see every token mapping present in [`src/components/button.css`](src/components/button.css).

## Token bundle topology

[`tokens/catalog.json`](tokens/catalog.json) aggregates the foundational, component, and theme documents through the `lapidist.catalog` extension so the build outputs expose coherent CSS and JSON bundles aligned with the DTIF architecture model described in the [Toolkit architecture overview](https://github.com/bylapidist/dtifx/blob/main/docs/overview/architecture.md). The same bundle is imported in [`design-lint.config.cjs`](design-lint.config.cjs), allowing design-lint to lint React and CSS code against the identical token graph that feeds the CLI. Consult the [build pipeline guide](https://github.com/bylapidist/dtifx/blob/main/docs/guides/build-pipeline.md) for a deeper explanation of how the DTIFx runtime stitches catalog sources together during generation.

### Theme overrides in action

Light, dark, and high-contrast variations live in [`tokens/themes/light.json`](tokens/themes/light.json) and [`tokens/themes/dark.json`](tokens/themes/dark.json). Each file contributes `$overrides` entries that the DTIF bundle resolves during generation; review the source documents alongside the consolidated catalogue in `ops/artifacts/diff/baseline.dtif.json` and the generated CSS variables in `ops/artifacts/build/tokens.css` to see how each condition is captured. The [DTIF theming and overrides specification](https://github.com/bylapidist/dtif/blob/main/docs/spec/theming-overrides.md) explains the registry schema and outlines how to trace overrides across the CLI outputs without introducing bespoke runtime helpers.

Running `npm run dtif:build` keeps those variable references in sync with the latest DTIF catalogue, while `npm run design-lint` verifies that `Button.jsx` and `button.css` comply with the approved token usage patterns documented in the [design-lint repo](https://github.com/bylapidist/design-lint).

## Inspecting artefacts

After each workflow, review the committed evidence in `ops/artifacts/` to compare results against the DTIFx documentation.

| Command | Evidence location | What to inspect |
| --- | --- | --- |
| `npm run verify` | Terminal output (ESLint summary followed by design-lint) | Confirm ESLint reports no errors and design-lint flags zero token violations, aligning with the [design-lint documentation](https://github.com/bylapidist/design-lint) and repo gating rules. |
| `dtifx build validate --config build/dtif-build.config.mjs` / `npm run dtif:validate` | Terminal output (`ops/artifacts/validate/` when logs are captured) | Ensure the validator exits successfully and note any compiler warnings before merging (see the [validation docs](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md)). |
| `dtifx build generate --config build/dtif-build.config.mjs` / `npm run dtif:build` | `ops/artifacts/build/tokens.css`, `tokens.json` | Verify the regenerated CSS and JSON token bundles align with the source DTIF documents per the [build outputs guide](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md). |
| `dtifx diff compare ... --format json` & `--format markdown` / `npm run dtif:diff` | `ops/artifacts/diff/report.json`, `report.md` | Review breaking or additive changes flagged in the Markdown summary according to the [diff handbook](https://github.com/bylapidist/dtifx/blob/main/docs/diff/index.md); use the JSON evidence to decide whether to refresh `baseline.dtif.json`. |
| `dtifx audit run --reporter json --reporter markdown --config audit/dtif-audit.config.mjs --out-dir ops/artifacts/audit` / `npm run dtif:audit` | `ops/artifacts/audit/report.json`, `report.md` | Check pass/fail status for each policy and investigate findings via the [audit command docs](https://github.com/bylapidist/dtifx/blob/main/docs/audit/index.md). |
| `design-lint lint "src/**/*.{css,js,jsx,ts,tsx}" --config design-lint.config.cjs` / `npm run design-lint` | Terminal output (`design-lint-report.json` when using `--output`) | Verify no token violations appear; follow the [design-lint README](https://github.com/bylapidist/design-lint). |

For a deeper walkthrough of the artefact structure, read [`ops/artifacts/README.md`](ops/artifacts/README.md), which maps each CLI output back to the DTIF sources and expected governance checkpoints.

## Continuous integration

- GitHub Actions workflow `.github/workflows/ci.yml` installs dependencies with `npm ci` on Node.js 22.21.0 and runs `npm run verify`, `npm run dtif:validate`, `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` on every push and pull request.

## Reference documentation

- DTIFx Toolkit: https://dtifx.lapidist.net/
- design-lint: https://design-lint.lapidist.net/

## Contributing and support

- Review `CONTRIBUTING.md` for workflow expectations aligned with this minimal stack.
- See `SECURITY.md` for vulnerability disclosure and hardening guidelines.
