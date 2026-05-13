# Script Reference

All `pnpm run` scripts, annotated with frequency and prerequisites.

**Legend:**
- 🟢 **daily** — part of normal development workflow
- 🔵 **token changes** — run when token files change
- 🟡 **CI only** — normally run by CI, not manually
- ⚪ **debugging / advanced** — run when investigating issues or exploring the API

---

## Daily development

| Script | What it does | Freq | Prereqs |
|---|---|---|---|
| `verify` | ESLint + design-lint. **Must pass before every commit.** | 🟢 | `kernel:start` |
| `lint` | ESLint only | 🟢 | — |
| `lint:fix` | ESLint with auto-fix | 🟢 | — |
| `format` | Prettier check (read-only) | 🟢 | — |
| `format:write` | Prettier with auto-fix | 🟢 | — |

---

## DSR kernel lifecycle

The kernel must be running for any `design-lint` command to work. It reads token files at startup — restart it after any token change.

| Script | What it does | Freq | Prereqs |
|---|---|---|---|
| `kernel:start` | Start the kernel, seed with `catalog.tokens.json` | 🟢 | — |
| `kernel:start:http` | Start with HTTP fallback on port 7341 | ⚪ | — |
| `kernel:start:no-http` | Start with HTTP transport disabled | ⚪ | — |
| `kernel:stop` | Stop the running kernel | 🟢 | — |
| `kernel:status` | Print PID and socket path if running | 🟢 | — |

---

## DSR kernel write commands

These modify the running kernel's token graph. Changes are **transient** — they reset when the kernel is restarted. Use them for scripting, live debugging, or build integrations.

Edit the relevant script in `package.json` to target your own tokens before running.

| Script | What it does | Freq |
|---|---|---|
| `kernel:token-add` | Register a new color token at `#/clr/new` | ⚪ |
| `kernel:token-deprecate` | Mark `#/clr/accent` deprecated → `#/clr/brand` | ⚪ |
| `kernel:component-register` | Register Button as a design system component | ⚪ |
| `kernel:rule-configure` | Set `design-token/colors` to error with options | ⚪ |

---

## design-lint — linting

| Script | What it does | Freq | Prereqs |
|---|---|---|---|
| `design-lint` | Lint all source files | 🟢 | `kernel:start` |
| `design-lint:validate` | Validate config, plugins, and rule names — no lint pass | 🟢 | `kernel:start` |
| `design-lint:fix` | Auto-fix violations in place | 🟢 | `kernel:start` |
| `design-lint:check` | Lint with `--fail-on-empty --max-warnings 100` | 🟡 | `kernel:start` |
| `design-lint:quiet` | Lint with suppressed output (exit code only) | ⚪ | `kernel:start` |
| `design-lint:ignore-path` | Lint while honouring extra ignores from `.gitignore` | ⚪ | `kernel:start` |

---

## design-lint — output formats

| Script | Output file | Format | Freq |
|---|---|---|---|
| `design-lint:sarif` | `ops/artifacts/lint/report.sarif` | SARIF 2.1.0 | 🟡 |
| `design-lint:summary` | stdout | Custom one-line summary | ⚪ |
| `design-lint:report` | `ops/artifacts/lint/results.json` | Raw JSON | 🟡 |
| `design-lint:dscp` | `ops/artifacts/lint/DESIGN_LINT.md` | DSCP v1 with lint results | 🟡 |

---

## design-lint — token export and docs

| Script | Output | Freq | Prereqs |
|---|---|---|---|
| `design-lint:tokens` | `ops/artifacts/build/design-tokens.json` | 🔵 | `kernel:start` |
| `design-lint:tokens-themed` | `ops/artifacts/build/design-tokens-default.json` (default theme only) | ⚪ | `kernel:start` |
| `design-lint:docs` | `ops/artifacts/docs/` (Markdown site) | 🟡 | `kernel:start` |

---

## design-lint — caching and watch

| Script | What it does | Freq | Prereqs |
|---|---|---|---|
| `design-lint:cache` | Lint with persistent cache (`.designlintcache`) | 🟢 | `kernel:start` |
| `design-lint:cache-location` | Lint with cache at explicit path `.designlintcache` | ⚪ | `kernel:start` |
| `design-lint:watch` | Re-lint on file change with cache | 🟢 | `kernel:start` |

---

## design-lint — kernel snapshots

| Script | What it does | Freq | Prereqs |
|---|---|---|---|
| `design-lint:snapshot` | Export kernel graph to `ops/artifacts/build/kernel-snapshot.bin` | 🔵 | `kernel:start` |
| `design-lint:snapshot-diff` | Export new snapshot; diff against `ops/artifacts/snapshots/baseline.bin` | 🟡 | `kernel:start` |

---

## design-lint — programmatic API demos

These scripts exist to demonstrate the Node.js API, not as workflow tools.

| Script | Demonstrates |
|---|---|
| `design-lint:api-check` | `createLinter`, `lintTargets`, `lintDocument`, `lintDocuments`, `getTokenCompletions`, `applyFixes`, `parseInlineDtifTokens` |
| `design-lint:generate-tokens` | `parseDtifTokensFile`, `flattenDesignTokens`, `indexDtifTokens`, `createDtifNameIndex`, `DtifTokenRegistry`, `generateCssVariables`, `generateJsConstants`, `generateTsDeclarations` |

---

## DTIFx token pipeline

| Script | Output | Freq | Prereqs |
|---|---|---|---|
| `dtif:validate` | Pass/fail only | 🔵 | — |
| `dtif:build` | `ops/artifacts/build/tokens.css`, `tokens.json` | 🔵 | — |
| `dtif:diff` | `ops/artifacts/diff/report.json` + console | 🔵 | `dtif:build` |
| `dtif:audit` | `ops/artifacts/audit/report.json`, `report.md` | 🔵 | — |
| `dtif:dscp` | `DESIGN_SYSTEM.md` | 🔵 | `dtif:build` |

---

## Order of operations

**Quick check before committing:**
```
kernel:start → verify
```

**Full token change cycle:**
```
dtif:validate → kernel:stop → kernel:start → verify → dtif:build → dtif:diff → dtif:audit → dtif:dscp
```

**CI pipeline order:**
```
(install) → kernel:start → design-lint:validate → verify → design-lint:check
→ design-lint:sarif → design-lint:report → design-lint:dscp → design-lint:snapshot-diff
→ dtif:validate → dtif:build → dtif:diff → dtif:audit → kernel:stop
```
