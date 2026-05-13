# ops/

This directory contains two kinds of things: **generated outputs** (committed for review) and **tooling** (scripts, plugins, formatters used by the build pipeline).

---

## artifacts/ — generated outputs

Everything under `artifacts/` is produced by a `pnpm run dtif:*` or `pnpm run design-lint:*` command and committed to the repository so PR reviewers can inspect changes without re-running the tools.

| Subdirectory | Produced by | Contents |
|---|---|---|
| `artifacts/build/` | `dtif:build` | `tokens.css` (CSS custom properties), `tokens.json` (JSON snapshot) |
| `artifacts/diff/` | `dtif:diff` | `baseline.dtif.json` (approved baseline), `report.json` (current diff) |
| `artifacts/audit/` | `dtif:audit` | `report.json`, `report.md` — governance policy results |
| `artifacts/docs/` | `design-lint:docs` | Markdown documentation site for tokens and rules |
| `artifacts/lint/` | `design-lint:sarif`, `design-lint:report`, `design-lint:dscp` | SARIF report, raw JSON results, DSCP design system document |
| `artifacts/snapshots/` | `design-lint:snapshot` | `baseline.bin` (committed), `current.bin` (transient) |
| `artifacts/generated/` | `design-lint:generate-tokens` | CSS, JS, TypeScript generated from token catalog _(gitignored)_ |

**Do not edit artifacts manually.** Regenerate them with the appropriate command.

---

## scripts/ — programmatic API demonstrations

Node.js scripts that demonstrate the design-lint v8 Node.js API. Not part of the main daily workflow — they show what is possible programmatically.

| File | Demonstrates |
|---|---|
| `scripts/lint-check.js` | `createLinter`, `createLintService`, `setupLinter`, `lintTargets`, `lintDocument`, `lintDocuments`, `getTokenCompletions`, `getFormatter`, `applyFixes`, `parseInlineDtifTokens` |
| `scripts/generate-tokens.js` | `parseDtifTokensFile`, `readDtifTokensFile`, `flattenDesignTokens`, `indexDtifTokens`, `createDtifNameIndex`, `DtifTokenRegistry`, `generateCssVariables`, `generateJsConstants`, `generateTsDeclarations` |
| `scripts/build-presets.js` | Strips TypeScript syntax from preset packages to produce importable ESM dist files. Runs automatically via the `prepare` lifecycle hook after `pnpm install`. |

Run them with:
```bash
pnpm run design-lint:api-check        # lint-check.js
pnpm run design-lint:generate-tokens  # generate-tokens.js
```

---

## plugins/ — custom design-lint rules

| File | Rule | What it enforces |
|---|---|---|
| `plugins/dtifx-rules.js` | `dtifx/no-hardcoded-color-values` | Flags raw color literals on CSS color properties when registered token vars are available |

The plugin is loaded via `plugins: ['./ops/plugins/dtifx-rules.js']` in `designlint.config.js`. It demonstrates `meta.schema` (Zod), `getDtifTokens()`, `getTokenPath()`, and `init(env)`.

To activate the rule at runtime, add `'dtifx/no-hardcoded-color-values': 'warn'` to `rules` in `designlint.config.js`. Do not add custom plugin rules to `rules:` if you also run `design-lint:validate` — validate checks rule names before plugin rules are registered and will report "Unknown rule".

---

## formatters/ — custom output formatters

| File | Used by | Output |
|---|---|---|
| `formatters/summary.js` | `design-lint:summary` | One-line summary: `✓ design-lint: 0 errors, 46 warnings across 4 file(s)` |

Invoke any formatter via `--format ./ops/formatters/summary.js` on the CLI, or set `format` in `designlint.config.js`.

---

## policies/ — governance policy files

| File | Purpose |
|---|---|
| `policies/base.policy.json` | Base governance constraints: required rules, minimum severity, ratchet mode |

`designlint.policy.json` at the repo root extends this file via `"extends": ["./ops/policies/base.policy.json"]` and adds project-specific constraints on top.
