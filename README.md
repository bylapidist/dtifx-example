# DTIFx Minimal Stack Example

This repository demonstrates a canonical, production-ready setup of the DTIFx Toolkit paired with design-lint for validating CSS and React usage against the published token catalogue.

## Repository layout

- Tokens: `tokens/` stores the DTIF documents (`foundations.json`, `components/*.json`, `themes/*.json`, `catalog.json`) that feed the CLI.
- Sample UI usage: `src/components/` contains a React example and stylesheet checked by design-lint to illustrate consuming the generated tokens.
- Artefacts: `ops/artifacts/` captures outputs from DTIF build, diff, audit, and validation commands committed for review (see [`ops/artifacts/README.md`](ops/artifacts/README.md)).
- Tooling config: `build/`, `audit/`, `design-lint.config.js`, and `eslint.config.js` configure the official CLI workflows without custom wrappers.

## Prerequisites

1. Install Node.js 24 (`nvm use`).
2. Install [pnpm](https://pnpm.io) ≥ 10.
3. Run `pnpm install` to fetch the DTIFx CLI, design-lint, and linting dependencies.

## Quick start

1. Clone the repository and install dependencies: `git clone https://github.com/bylapidist/dtifx-example.git && cd dtifx-example && pnpm install` (see the [DTIFx setup overview](https://github.com/bylapidist/dtifx/blob/main/docs/overview/index.md)).
2. Start the DSR kernel and seed tokens: `pnpm run kernel:start`. This runs `design-lint kernel start --config-path design-lint.config.js`, which starts the daemon and loads tokens from `tokens/catalog.json` into the kernel's in-memory token graph. The kernel must be running and seeded before `design-lint` can report token violations.
3. Run `pnpm run verify` to execute ESLint followed by design-lint; expect both tools to exit cleanly, mirroring the default gate enforced in [`CONTRIBUTING.md`](CONTRIBUTING.md).
4. Validate the DTIF catalogue with `pnpm run dtif:validate`; expect `dtifx build validate` to finish without errors.
5. Generate token outputs with `pnpm run dtif:build`; the CLI writes `tokens.css` and `tokens.json` to `ops/artifacts/build/`.
6. Generate the DSCP design system document with `pnpm run dtif:dscp`; the CLI writes `DESIGN_SYSTEM.md` from the built token graph.
7. Run `pnpm run dtif:diff` to compare against the baseline.
8. Audit governance policies with `pnpm run dtif:audit`.
9. Lint the sample UI with `pnpm run design-lint`.
10. Stop the kernel when done: `pnpm run kernel:stop`.

## Core commands

- `pnpm run kernel:start`: Start the DSR kernel daemon and seed it with tokens from `design-lint.config.js`.
- `pnpm run kernel:stop`: Stop the DSR kernel daemon.
- `pnpm run kernel:status`: Check whether the DSR kernel is running.
- `pnpm run dtif:validate`: Validates all DTIF sources against the schema.
- `pnpm run dtif:build`: Regenerates `ops/artifacts/build/tokens.{css,json}`.
- `pnpm run dtif:dscp`: Generates `DESIGN_SYSTEM.md` from the built token graph via `dtifx dscp generate`.
- `pnpm run dtif:diff`: Compares catalog against the committed baseline.
- `pnpm run dtif:audit`: Evaluates governance policies and commits JSON/Markdown evidence.
- `pnpm run design-lint`: Verifies the example UI honours the canonical tokens.
- `pnpm run verify`: Runs ESLint followed by design-lint.

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

## Token bundle topology

[`tokens/catalog.json`](tokens/catalog.json) aggregates the foundational, component, and theme documents through the `lapidist.catalog` extension so the build outputs expose coherent CSS and JSON bundles aligned with the DTIF architecture model. The `tokens.default` path in `design-lint.config.js` points to this catalog; when you run `pnpm run kernel:start`, the kernel daemon reads that path via `--config-path` and seeds its in-memory token graph. The linter then queries tokens from the running kernel via DSQL rather than loading them from config directly.

## Inspecting artefacts

After each workflow, review the committed evidence in `ops/artifacts/` to compare results against the DTIFx documentation.

| Command | Evidence location |
| --- | --- |
| `pnpm run verify` | Terminal output |
| `pnpm run dtif:validate` | Terminal output |
| `pnpm run dtif:build` | `ops/artifacts/build/tokens.css`, `tokens.json` |
| `pnpm run dtif:diff` | `ops/artifacts/diff/report.json` plus console output |
| `pnpm run dtif:audit` | `ops/artifacts/audit/report.json`, `report.md` |
| `pnpm run design-lint` | Terminal output |

## Continuous integration

GitHub Actions workflow `.github/workflows/ci.yml` installs dependencies with `pnpm install --frozen-lockfile` on Node.js 24 and runs the verify, validate, build, diff, and audit commands on every push and pull request.

## Reference documentation

- DTIFx Toolkit: https://dtifx.lapidist.net/
- design-lint: https://design-lint.lapidist.net/

## Contributing and support

- Review `CONTRIBUTING.md` for workflow expectations aligned with this minimal stack.
- See `SECURITY.md` for vulnerability disclosure and hardening guidelines.
