# Script Reference

Every `pnpm run` script, grouped by purpose.

---

## Daily development

| Script | What it does |
|---|---|
| `verify` | Runs ESLint then design-lint. **Must pass before every commit.** |
| `lint` | ESLint only |
| `lint:fix` | ESLint with auto-fix |
| `format` | Prettier check (no changes) |
| `format:write` | Prettier with auto-fix |

---

## DSR kernel lifecycle

The kernel must be running for any design-lint command to work.

| Script | What it does |
|---|---|
| `kernel:start` | Start the kernel and load tokens from `designlint.config.js` |
| `kernel:start:http` | Start with HTTP fallback transport on port 7341 |
| `kernel:start:no-http` | Start with HTTP transport disabled (Unix socket only) |
| `kernel:stop` | Stop the running kernel |
| `kernel:status` | Print whether the kernel is running and its PID |

---

## DSR kernel write commands

These write directly to the running kernel. Changes are transient — they reset on kernel restart. Use them for scripting, testing, or live experiments.

| Script | What it does |
|---|---|
| `kernel:token-add` | Register a new color token at `#/clr/new` |
| `kernel:token-deprecate` | Mark `#/clr/accent` as deprecated, pointing to `#/clr/brand` |
| `kernel:component-register` | Register `Button` as a design system component |
| `kernel:rule-configure` | Set `design-token/colors` severity to error with options |

To use these for your own tokens, edit the relevant script in `package.json`.

---

## design-lint — linting

| Script | What it does | When to use |
|---|---|---|
| `design-lint` | Lint all source files (CSS, SCSS, Less, JSX, JS, TS) | Daily — same as what `verify` runs |
| `design-lint:validate` | Validate the config file and active rules | After editing `designlint.config.js` |
| `design-lint:fix` | Auto-fix lint violations in place | Before committing, to clean up fixable issues |
| `design-lint:check` | Lint with `--fail-on-empty --max-warnings 100` | CI — enforces the warning budget |
| `design-lint:quiet` | Lint with suppressed stdout (exit code only) | Scripts that need pass/fail without output |
| `design-lint:ignore-path` | Lint while honouring extra ignore patterns from `.gitignore` | When you want to exclude gitignored files |

---

## design-lint — output formats

| Script | Output | Format |
|---|---|---|
| `design-lint:sarif` | `ops/artifacts/lint/report.sarif` | SARIF 2.1.0 (GitHub code scanning) |
| `design-lint:summary` | Stdout | Custom one-line summary (`ops/formatters/summary.js`) |
| `design-lint:report` | `ops/artifacts/lint/results.json` | Raw JSON lint results |
| `design-lint:dscp` | `ops/artifacts/lint/DESIGN_LINT.md` | DSCP v1 design system doc with lint results |

---

## design-lint — token export and docs

| Script | What it does |
|---|---|
| `design-lint:tokens` | Export flattened token JSON from the kernel to `ops/artifacts/build/design-tokens.json` |
| `design-lint:tokens-themed` | Export tokens for the `default` theme only |
| `design-lint:docs` | Generate Markdown documentation site to `ops/artifacts/docs/` |

---

## design-lint — caching and watch

| Script | What it does |
|---|---|
| `design-lint:cache` | Lint with persistent file cache (`.designlintcache`) |
| `design-lint:cache-location` | Lint with cache written to `.designlintcache` explicitly |
| `design-lint:watch` | Re-lint on file change with cache enabled (for development) |

---

## design-lint — kernel snapshots

| Script | What it does |
|---|---|
| `design-lint:snapshot` | Export the current kernel token graph to `ops/artifacts/build/kernel-snapshot.bin` |
| `design-lint:snapshot-diff` | Export a new snapshot and diff it against `ops/artifacts/snapshots/baseline.bin` |

---

## design-lint — programmatic API demos

| Script | What it does |
|---|---|
| `design-lint:api-check` | Run `ops/scripts/lint-check.js` — demonstrates the Node.js programmatic API |
| `design-lint:generate-tokens` | Run `ops/scripts/generate-tokens.js` — demonstrates parseDtifTokensFile, generateCssVariables, etc. |

---

## DTIFx token pipeline

| Script | What it does | Artifacts produced |
|---|---|---|
| `dtif:validate` | Validate all token files against the DTIF schema | (none — pass/fail only) |
| `dtif:build` | Generate CSS and JSON from token sources | `ops/artifacts/build/tokens.css`, `tokens.json` |
| `dtif:diff` | Compare current tokens against the baseline | `ops/artifacts/diff/report.json` |
| `dtif:audit` | Run governance policies | `ops/artifacts/audit/report.json`, `report.md` |
| `dtif:dscp` | Generate `DESIGN_SYSTEM.md` from build outputs | `DESIGN_SYSTEM.md` |

---

## Order of operations

For a full token change cycle:

```
dtif:validate → kernel:stop → kernel:start → verify → dtif:build → dtif:diff → dtif:audit → dtif:dscp
```

For a quick check before committing:

```
verify
```

For CI (see `.github/workflows/ci.yml`):

```
kernel:start → design-lint:validate → verify → design-lint:check → design-lint:sarif
→ dtif:validate → dtif:build → dtif:diff → dtif:audit → kernel:stop
```
