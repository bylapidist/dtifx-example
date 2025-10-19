# DTIFx Minimal Stack Example

This repository demonstrates a canonical, production-ready setup of the DTIFx Toolkit paired with design-lint for validating CSS and React usage against the published token catalogue.

## Repository layout

- Tokens: `tokens/` stores the DTIF documents (`foundations.dtif.json`, `components/*.dtif.json`, `themes/*.dtif.json`, `index.dtif.json`) that feed the CLI.
- Sample UI usage: `src/components/` contains a React example and stylesheet checked by design-lint to illustrate consuming the generated tokens.
- Artefacts: `ops/artifacts/` captures outputs from DTIF build, diff, audit, and validation commands committed for review (see [`ops/artifacts/README.md`](ops/artifacts/README.md)).
- Tooling config: `build/`, `audit/`, `design-lint.config.cjs`, and `eslint.config.js` configure the official CLI workflows without custom wrappers.

## Prerequisites

1. Install Node.js 22.20.0 (`nvm use`).
2. Run `npm install` to fetch the DTIFx CLI, design-lint, and linting dependencies.

## Quick start

1. Clone the repository and install dependencies: `git clone https://github.com/bylapidist/dtifx-example.git && cd dtifx-example && npm install` (see the [DTIFx setup overview](https://github.com/bylapidist/dtifx/blob/main/docs/overview/index.md)).
2. Run `npm run verify` to execute ESLint followed by design-lint; expect both tools to exit cleanly, mirroring the default gate enforced in [`CONTRIBUTING.md`](CONTRIBUTING.md).
3. Validate the DTIF catalogue with `npm run dtif:validate`; expect `dtifx build validate` to finish without errors, and when you need persistent evidence capture the CLI output under `ops/artifacts/validate/` as described in [`ops/artifacts/validate/README.md`](ops/artifacts/validate/README.md) and the [CLI validation guide](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md).
4. Generate token outputs via `npm run dtif:build`; confirm the `generatedAt` metadata in `ops/artifacts/build/registry.json` (and `telemetry.json` when present) updates, then inspect `tokens.css` / `tokens.json` for refreshed values alongside the [DTIF build reference](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md).
5. Run `npm run dtif:diff` to compare against the baseline; review both `ops/artifacts/diff/report.md` and `report.json`, and replace `baseline.dtif.json` with the newly approved snapshot as described in [`ops/artifacts/diff/README.md`](ops/artifacts/diff/README.md) and the [diff comparison docs](https://github.com/bylapidist/dtifx/blob/main/docs/diff/index.md). When metadata-only churn appears (for example, file URI changes), inspect the JSON evidence to understand what changed and decide whether to refresh the baseline.
6. Audit governance policies with `npm run dtif:audit` and inspect the JSON/Markdown reports in `ops/artifacts/audit/` per the [audit command reference](https://github.com/bylapidist/dtifx/blob/main/docs/audit/index.md).
7. Lint the sample UI with `npm run design-lint`; confirm the terminal reports zero violations and consult the [design-lint usage guide](https://design-lint.lapidist.net/).

## Core commands

- `npm run dtif:validate`: Runs `dtifx build validate` against `build/dtif-build.config.mjs` to ensure all DTIF sources compile.
- `npm run dtif:build`: Executes `dtifx build generate --config build/dtif-build.config.mjs` to refresh `ops/artifacts/build/{registry,telemetry}.json` alongside the CSS/JSON outputs defined by the config.
- `npm run dtif:diff`: Calls `dtifx diff compare ops/artifacts/diff/baseline.dtif.json tokens/index.dtif.json --format json --output ops/artifacts/diff/report.json` and repeats with `--format markdown` to produce JSON/Markdown evidence for review.
- `npm run dtif:audit`: Runs `dtifx audit run --reporter json --reporter markdown --config audit/dtif-audit.config.mjs --out-dir ops/artifacts/audit` to evaluate governance policies and commit JSON/Markdown evidence.
- `npm run design-lint`: Invokes `design-lint lint "src/**/*.{css,js,jsx,ts,tsx}" --config design-lint.config.cjs` to verify the example UI honours the canonical tokens.
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
  gap: var(--tokens-foundations-dtif-json-spacing-md);
  padding-block: var(--tokens-components-button-dtif-json-component-button-padding);
  padding-inline: var(--tokens-foundations-dtif-json-spacing-lg);
  font-weight: var(--tokens-foundations-dtif-json-font-weight-variables-semibold, 600);
  border: none;
  cursor: pointer;
  background-color: var(--tokens-components-button-dtif-json-component-button-background);
  color: var(--tokens-components-button-dtif-json-component-button-text);
  transition: background-color var(--tokens-foundations-dtif-json-duration-variables-button, 120ms) ease-in-out;
}

.button-primary:hover,
.button-primary:focus-visible {
  background-color: var(--tokens-components-button-dtif-json-component-button-background-hover);
}

.button-primary--emphasize {
  padding-block: var(--tokens-components-button-dtif-json-component-button-padding);
  padding-inline: var(--tokens-foundations-dtif-json-spacing-lg);
}
```

The transition definition surfaces the shared duration token, while the hover/focus rule references the variant background colour override so readers can see every token mapping present in [`src/components/button.css`](src/components/button.css).

## Token bundle topology

[`tokens/index.dtif.json`](tokens/index.dtif.json) aggregates the foundational, component, and theme documents through the `lapidist.catalog` extension so the build outputs expose a single registry aligned with the DTIF architecture model described in the [Toolkit architecture overview](https://github.com/bylapidist/dtifx/blob/main/docs/overview/architecture.md). The same bundle is imported in [`design-lint.config.cjs`](design-lint.config.cjs), allowing design-lint to lint React and CSS code against the identical token graph that feeds the CLI. Consult the [build pipeline guide](https://github.com/bylapidist/dtifx/blob/main/docs/guides/build-pipeline.md) for a deeper explanation of how the DTIFx runtime stitches catalog sources together during generation.

### Theme overrides in action

Light, dark, and high-contrast variations live in [`tokens/themes/light.dtif.json`](tokens/themes/light.dtif.json) and [`tokens/themes/dark.dtif.json`](tokens/themes/dark.dtif.json). Each file contributes `$overrides` entries that are merged into the registry; you can inspect the resolved conditions in `ops/artifacts/build/registry.json` after running `npm run dtif:build`.

To experiment locally, load the registry and check the `$overrides` array to see which tokens change per `theme` or `accessibility` flag, then reapply the affected CSS custom properties when toggling modes. The snippet below mirrors the shape of [`ops/artifacts/build/registry.json`](ops/artifacts/build/registry.json) so you can wire runtime toggles directly to the generated evidence:

```js
import registry from '../ops/artifacts/build/registry.json' assert { type: 'json' };

const baseVariables = new Map(
  registry.tokens.map((token) => [`--tokens-index-dtif-json-${token.variable}`, token.value]),
);

export function applyTheme(theme, accessibility) {
  const root = document.documentElement;
  baseVariables.forEach((value, name) => root.style.setProperty(name, value));
  registry.overrides
    .filter((entry) => entry.conditions.theme === theme)
    .filter((entry) => !entry.conditions.accessibility || entry.conditions.accessibility === accessibility)
    .forEach((entry) => {
      root.style.setProperty(`--tokens-index-dtif-json-${entry.variable}`, entry.value);
    });
  root.dataset.theme = theme;
  if (accessibility) {
    root.dataset.accessibility = accessibility;
  } else {
    delete root.dataset.accessibility;
  }
}

applyTheme('light');
```

Calling `applyTheme('dark')` swaps the variables defined in the registry without changing your component markup, and you can pass `'high-contrast'` as the second argument to preview the light high-contrast overrides. The [DTIF theming and overrides specification](https://github.com/bylapidist/dtif/blob/main/docs/spec/theming-overrides.md) breaks down the conditional schema in detail.

Because the runtime helper repopulates every `--tokens-index-dtif-json-*` variable before layering overrides, tokens such as `fontWeightVariables.semibold` and `durationVariables.button` keep their CSS variables in sync even though they are expressed as custom DTIF dimensions rather than static CSS length declarations.

Running `npm run dtif:build` keeps those variable references in sync with the latest DTIF catalogue, while `npm run design-lint` verifies that `Button.jsx` and `button.css` comply with the approved token usage patterns documented in the [design-lint repo](https://github.com/bylapidist/design-lint).

## Inspecting artefacts

After each workflow, review the committed evidence in `ops/artifacts/` to compare results against the DTIFx documentation.

| Command | Evidence location | What to inspect |
| --- | --- | --- |
| `npm run verify` | Terminal output (ESLint summary followed by design-lint) | Confirm ESLint reports no errors and design-lint flags zero token violations, aligning with the [design-lint documentation](https://github.com/bylapidist/design-lint) and repo gating rules. |
| `npm run dtif:validate` | Terminal output (`ops/artifacts/validate/` when logs are captured) | Ensure `dtifx build validate` exits successfully and note any compiler warnings before merging (see the [validation docs](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md)). |
| `npm run dtif:build` | `ops/artifacts/build/registry.json`, `telemetry.json`, `tokens.css`, `tokens.json` | Verify the latest run metadata (`generatedAt`) and confirm token names/values align with the source DTIF documents per the [build outputs guide](https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md). |
| `npm run dtif:diff` | `ops/artifacts/diff/*.md`, `*.json` | Review breaking or additive changes flagged in the Markdown summary according to the [diff handbook](https://github.com/bylapidist/dtifx/blob/main/docs/diff/index.md); use the JSON evidence to decide whether to refresh `baseline.dtif.json`. |
| `npm run dtif:audit` | `ops/artifacts/audit/*.md`, `*.json` | Check pass/fail status for each policy and investigate findings via the [audit command docs](https://github.com/bylapidist/dtifx/blob/main/docs/audit/index.md). |
| `npm run design-lint` | Terminal output (`design-lint-report.json` when using `--output`) | Verify no token violations appear; follow the [design-lint README](https://github.com/bylapidist/design-lint). |

For a deeper walkthrough of the artefact structure, read [`ops/artifacts/README.md`](ops/artifacts/README.md), which maps each CLI output back to the DTIF sources and expected governance checkpoints.

## Continuous integration

- GitHub Actions workflow `.github/workflows/ci.yml` installs dependencies with `npm ci` on Node.js 22.20.0 and runs `npm run verify`, `npm run dtif:validate`, `npm run dtif:build`, `npm run dtif:diff`, and `npm run dtif:audit` on every push and pull request.

## Reference documentation

- DTIFx Toolkit: https://dtifx.lapidist.net/
- design-lint: https://design-lint.lapidist.net/

## Contributing and support

- Review `CONTRIBUTING.md` for workflow expectations aligned with this minimal stack.
- See `SECURITY.md` for vulnerability disclosure and hardening guidelines.
