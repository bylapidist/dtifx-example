# ops/

Two kinds of content: **generated artifacts** (committed for PR review) and **tooling** (scripts, plugins, formatters, policies).

---

## artifacts/ — generated outputs

Everything here is produced by a `pnpm run dtif:*` or `pnpm run design-lint:*` command. Artifacts are committed to the repository so PR reviewers can inspect changes without running the tools locally.

**Do not edit artifacts manually.** Regenerate them with the appropriate command.

| Subdirectory | Command | Contents |
|---|---|---|
| `artifacts/build/` | `dtif:build` | `tokens.css` (CSS custom properties), `tokens.json` (full token snapshot) |
| `artifacts/diff/` | `dtif:diff` | `baseline.dtif.json` (approved token baseline), `report.json` (current diff vs baseline) |
| `artifacts/audit/` | `dtif:audit` | `report.json`, `report.md` — governance policy results |
| `artifacts/docs/` | `design-lint:docs` | Markdown documentation site for tokens and rules |
| `artifacts/lint/` | `design-lint:sarif`, `design-lint:report`, `design-lint:dscp` | `report.sarif`, `results.json`, `DESIGN_LINT.md` |
| `artifacts/snapshots/` | `design-lint:snapshot` | `baseline.bin` (committed), `current.bin` (transient, gitignored) |
| `artifacts/generated/` | `design-lint:generate-tokens` | CSS, JS, TypeScript API outputs — **gitignored**, not committed |

---

## scripts/ — programmatic API demonstrations

Node.js scripts demonstrating the design-lint v8 Node.js API. These are educational, not part of the daily workflow.

| File | Run with | Demonstrates |
|---|---|---|
| `scripts/lint-check.js` | `design-lint:api-check` | `createLinter`, `createLintService`, `setupLinter`, `lintTargets`, `lintDocument`, `lintDocuments`, `getTokenCompletions`, `getFormatter`, `applyFixes`, `parseInlineDtifTokens` |
| `scripts/generate-tokens.js` | `design-lint:generate-tokens` | `parseDtifTokensFile`, `readDtifTokensFile`, `flattenDesignTokens`, `indexDtifTokens`, `createDtifNameIndex`, `DtifTokenRegistry`, `generateCssVariables`, `generateJsConstants`, `generateTsDeclarations` |

---

## plugins/ — custom design-lint rules

| File | Rule | Purpose |
|---|---|---|
| `plugins/dtifx-rules.js` | `dtifx/no-hardcoded-color-values` | Demonstrates the plugin API: `meta.schema` (Zod), `getDtifTokens()`, `getTokenPath()`, `init(env)` |

The plugin is loaded via `plugins: ['./ops/plugins/dtifx-rules.js']` in `designlint.config.js`. To activate the rule at lint time, add `'dtifx/no-hardcoded-color-values': 'warn'` to the `rules` object.

> **Note:** Do not list custom plugin rules in `rules:` if you also run `design-lint:validate` — validate checks rule names before plugins are registered. The plugin is still loaded via `plugins:`.

---

## formatters/ — custom output formatters

| File | Script | Output |
|---|---|---|
| `formatters/summary.js` | `design-lint:summary` | `✓ design-lint: 0 errors, N warnings across N file(s)` |

Use any formatter via `--format ./ops/formatters/summary.js` on the CLI, or set `format` in `designlint.config.js`.

---

## policies/ — governance policy files

| File | Purpose |
|---|---|
| `policies/base.policy.json` | Base governance constraints: required rules, minimum severity, ratchet mode |

`designlint.policy.json` at the repo root extends this file:
```json
{ "extends": ["./ops/policies/base.policy.json"], … }
```
