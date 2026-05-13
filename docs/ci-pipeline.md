# CI Pipeline

What every step in `.github/workflows/ci.yml` does, what a failure means, and how to fix it.

---

## Pipeline overview

```
Install → Kernel start → Validate → Lint → Warning budget
       → SARIF report → JSON report → DSCP export
       → Snapshot diff → DTIF validate → Build → Diff → Audit
       → Kernel stop
```

All steps run on every push and pull request to every branch. The kernel is stopped in a cleanup step that runs even if earlier steps fail (`if: always()`).

---

## Step-by-step

### 1. Install dependencies
```bash
pnpm install --frozen-lockfile
```
Installs exactly what's in `pnpm-lock.yaml`. Fails if the lockfile doesn't match `package.json`.

**Common failures:**
- `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` — `package.json` has a `pnpm.patchedDependencies` entry or `pnpm-workspace.yaml` has one that the lockfile doesn't expect. Fix by running `pnpm install --no-frozen-lockfile` locally and committing the updated lockfile.
- `ERR_PNPM_OUTDATED_LOCKFILE` — `package.json` dependencies changed but the lockfile wasn't regenerated. Run `pnpm install` locally and commit.

---

### 2. Start DSR kernel
```bash
pnpm run kernel:start
```
Launches the kernel daemon and seeds it with tokens from `designlint.config.js` (which points to `tokens/catalog.tokens.json`).

**Common failures:**
- `Kernel did not start within 5 seconds` — token files have a schema error that prevented seeding. Run `pnpm run dtif:validate` locally to find the error.
- Connection refused in a later step — the kernel crashed after starting. Check token file validity.

---

### 3. Validate design-lint config
```bash
pnpm run design-lint:validate
```
Checks that `designlint.config.js` is valid: file syntax, plugin loading, rule names. Does not run lint.

**Common failures:**
- `Unknown rule(s): X` — a rule name in `rules:` isn't recognised. Check spelling. If it's a custom plugin rule, remove it from `rules:` (the plugin is loaded via `plugins:` and rules are only needed there for runtime linting, not validation).
- `Failed to load plugin` — the plugin file can't be resolved. Check the path in `plugins:`.

---

### 4. Run lint and design-lint
```bash
pnpm run verify   # = pnpm run lint && pnpm run design-lint
```
ESLint checks JavaScript syntax and style. design-lint checks token usage against the kernel.

**Reading the output:**
- `[OK] src/components/Button.jsx` — file passed all rules
- `error` lines — must be fixed before merging
- `warn` lines — should be reviewed; many are expected (e.g. `no-unused-tokens` for tokens not referenced in this minimal example)
- A clean run ends with: `N problems (0 errors, N warnings)`

**Common failures:**
- `design-token/colors` error on a CSS file — a raw hex/rgb value was used instead of a token var. Replace with `var(--catalog-tokens-*)`.
- `design-system/no-inline-styles` on a component — a `style` prop was added to a component listed in `no-inline-styles`. Use CSS classes instead.
- `DSR kernel failed to start` or connection error — kernel didn't start in step 2. Check step 2 output.

---

### 5. Enforce warning budget
```bash
pnpm run design-lint:check   # --fail-on-empty --max-warnings 100
```
Fails if any lint target resolves to no files (`--fail-on-empty`) or if total warnings exceed 100 (`--max-warnings 100`). This prevents silently-empty globs from passing and caps accumulated warnings.

**If this fails:** Either the glob expanded to no files (check the pattern in `package.json`) or warnings exceeded 100. To reduce warnings, address `no-unused-tokens` violations by using more tokens in source files, or remove unused token definitions.

---

### 6. Export SARIF report
```bash
pnpm run design-lint:sarif
```
Produces `ops/artifacts/lint/report.sarif` — a SARIF 2.1.0 file for GitHub code scanning.

---

### 7. Upload SARIF to GitHub code scanning
Uses `github/codeql-action/upload-sarif@v4`. Runs with `if: always()` so even failed lint runs are uploaded (you want to see *what* failed in the PR annotations). Results appear in the "Security" tab of the repository.

---

### 8–9. Export JSON report and DSCP document
```bash
pnpm run design-lint:report   # raw JSON results
pnpm run design-lint:dscp     # DESIGN_SYSTEM.md with lint results
```
Informational artifacts. Failures here are non-blocking for the design system workflow (though they will fail CI).

---

### 10. Snapshot diff
```bash
pnpm run design-lint:snapshot-diff
```
Exports the current kernel token graph as `ops/artifacts/snapshots/current.bin` and diffs it against the committed `ops/artifacts/snapshots/baseline.bin`. Shows what tokens were added, changed, or removed in this PR.

**If the diff shows unexpected changes:** A token was modified without intent. Check `tokens/foundations.json` and `tokens/catalog.tokens.json` for accidental edits. If the changes are intentional, update the baseline: `cp ops/artifacts/snapshots/current.bin ops/artifacts/snapshots/baseline.bin`.

---

### 11. Validate DTIF tokens
```bash
pnpm run dtif:validate
```
Validates all token files against the DTIF schema. Checks: required fields (`$type`, `$value`), key sort order, `$deprecated` pointer validity, shadow `$value` field order.

**Common failures:**
- `collection members must be sorted lexicographically` — a token group has keys out of alphabetical order. Fix by reordering the keys case-insensitively.
- `must have required property 'shadowType'` — shadow token is missing the required `shadowType` field in `$value`.
- `unevaluatedProperties` — a property name is not recognised by the schema (check for typos in `$type` or group names).

---

### 12. Generate build artifacts
```bash
pnpm run dtif:build
```
Regenerates `ops/artifacts/build/tokens.css` and `tokens.json` from all token sources. Fails if any source file is invalid.

---

### 13. Compare against diff baseline
```bash
pnpm run dtif:diff
```
Compares the current `tokens/catalog.tokens.json` against `ops/artifacts/diff/baseline.dtif.json`. Breaking changes (removed tokens, changed types) are highlighted.

**If this shows unexpected changes:** Either a token was accidentally removed or its type changed. Review `ops/artifacts/diff/report.json` for details.

**If the changes are intentional:** Update the baseline file: `cp tokens/catalog.tokens.json ops/artifacts/diff/baseline.dtif.json` and commit.

---

### 14. Execute audit policies
```bash
pnpm run dtif:audit
```
Runs governance policies from `audit/dtif-audit.config.mjs`. Currently checks that every token has an `owner` governance field.

**If this fails:** Check `ops/artifacts/audit/report.md` for which tokens are missing governance metadata. Add the `$extensions.lapidist.governance` block to the affected tokens in both `foundations.json` and `catalog.tokens.json`. See [docs/governance.md](governance.md).

---

### 15. Stop kernel (cleanup)
```bash
pnpm run kernel:stop
```
Sends SIGTERM to the kernel daemon. Runs with `if: always()` so it executes even if earlier steps fail, preventing zombie kernel processes on the runner.

**If this fails:** The kernel wasn't running (step 2 failed, or the kernel crashed). This is a no-op failure — it doesn't indicate a real problem.

---

## CI failure decision tree

```
CI failed — where do I look first?

pnpm install failed?
  → Check Node.js version matches engines.node in package.json (^24.0.0)
  → Check for pnpm lockfile/config mismatch (see step 1)

kernel:start failed?
  → Run dtif:validate locally — token schema error likely

verify failed?
  → Find the error lines in the output (not warnings)
  → design-token/* error: replace raw value with var(--catalog-tokens-*)
  → design-system/* error: check inline styles, component usage, variant props

design-lint:check failed (warning budget)?
  → Too many warnings — address no-unused-tokens or other warn-level rules

dtif:validate failed?
  → Key sort order violation — reorder alphabetically
  → Missing required field — add $type, $value, or shadowType

dtif:diff shows unexpected changes?
  → Review ops/artifacts/diff/report.json
  → Intentional? Update baseline.dtif.json
  → Accidental? Revert the token change

dtif:audit failed?
  → Check ops/artifacts/audit/report.md
  → Add missing governance metadata to affected tokens
```
