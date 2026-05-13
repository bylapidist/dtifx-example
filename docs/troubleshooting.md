# Troubleshooting

Symptoms, causes, and fixes for the most common problems.

---

## Installation

**`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` — `pnpm install --frozen-lockfile` fails**

The `pnpm.patchedDependencies` config (in `package.json` or `pnpm-workspace.yaml`) doesn't match what the lockfile expects. This happens when patches are added or removed without regenerating the lockfile.

Fix:
```bash
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "chore: sync lockfile"
```

**`ERR_PNPM_OUTDATED_LOCKFILE` — lockfile is out of date**

`package.json` dependencies changed but the lockfile wasn't regenerated.
```bash
pnpm install
git add pnpm-lock.yaml && git commit -m "chore: update lockfile"
```

---

## Kernel

**`design-lint: not found` after install**

`node_modules` wasn't installed before a script that calls `design-lint` ran. In CI, this usually means the install step failed and the cleanup step (`kernel:stop`) still tried to execute. Fix the install step first.

**`Kernel did not start within 5 seconds`**

The kernel started but timed out before the ready file appeared. Causes:
- A token file has a schema error that prevented seeding. Run `pnpm run dtif:validate` — look for schema violations.
- The machine is under heavy load. Try again; if persistent, increase the startup timeout.

**`connect ECONNREFUSED 127.0.0.1:7341` or `fetch failed`**

The kernel isn't running (or was stopped).
```bash
pnpm run kernel:status  # check
pnpm run kernel:start   # start it
```

**Rules all pass when they should fail after editing tokens**

The kernel was not restarted after the token change. It reads `catalog.tokens.json` once at startup.
```bash
pnpm run kernel:stop && pnpm run kernel:start
```

**design-lint reports "no tokens configured" for a rule**

The rule requires a specific token group that doesn't exist in the catalog. For example, `design-token/animation` needs an `animations` group with `$type: "string"` tokens. The rule disables itself if its required group is absent.

---

## Token validation

**`collection members must be sorted lexicographically`**

Keys in a token group are out of alphabetical order (case-insensitive). Move the offending key to its correct position.

```
Error: collection members must be sorted lexicographically (#/spacing)
```
This means `spacing` group members need reordering. Sort keys case-insensitively: `lg` < `md` < `sm`.

**`must have required property 'shadowType'`**

Shadow token `$value` objects require a `shadowType` field. The keys must also be in alphabetical order:
```json
"$value": {
  "blur": { … },
  "color": { … },
  "offsetX": { … },
  "offsetY": { … },
  "shadowType": "css.box-shadow",
  "spread": { … }
}
```

**`canonical key order violated`**

The keys inside a `$value` object are not in the expected order. For dimension values, the required order is `dimensionType`, `value`, `unit`.

**`unevaluatedProperties must NOT have unevaluated properties`**

A property name isn't in the schema. Common causes:
- Typo in `$type` (e.g. `"shadow"` without `shadowType` in `$value` cascades to this error)
- A new token group name that doesn't match the DTIF schema's expected patterns — confirm the group key is a recognised DTIF group name

---

## Building

**`DESIGN_SYSTEM.md` contains duplicate token entries**

The `dtif:dscp` generation processes `catalog.tokens.json` (which inlines all tokens) alongside `foundations.json` (which defines the same tokens). Both sources produce entries in the output, causing duplicates. This is a known limitation of the current build pipeline.

**`tokens.css` doesn't contain a variable I expect**

Not all token types produce CSS custom properties. Only `color` and `dimension` with `dimensionType: "length"` emit vars. For `fontWeight`, `duration`, `cubicBezier`, `number`, `string`, and `shadow` types, use raw CSS values that match the token value — design-lint validates them via value-equivalence mode.

---

## Linting

**`Unexpected color …` on a `box-shadow` declaration**

The `design-token/colors` rule scans `box-shadow` declarations for color values. If you have a raw `rgba()` in a box-shadow that isn't a registered color, this fires even if the full shadow matches a shadow token. Use `var(--...)` references for shadow values if possible, or add the color as a token.

**`Unexpected spacing 2px` on an `outline` declaration**

`design-token/spacing` with `{ base: 0 }` checks all dimension values. `2px` is not in the `spacing` group (which has 16px and 24px). Use a CSS var reference for the outline value, or ensure the value matches a `spacing` group token.

**CSS var reference flagged by `css-var-provenance`**

The rule expects var names derived from token pointers (e.g. `--clr-brand` from `#/clr/brand`), but our build uses stem-prefixed names (e.g. `--catalog-tokens-clr-brand`). This rule is set to `warn` in this repo for this reason — see [docs/architecture.md](architecture.md).

**`design-lint validate` reports `Unknown rule: dtifx/no-hardcoded-color-values`**

Custom plugin rules cannot be listed in `rules:` for validate to pass — validate checks rule names before plugins are fully registered. Remove the rule from `rules:` (the plugin is still loaded via `plugins:` and the rule will run during normal linting).

---

## CI

**`kernel:stop` fails with `design-lint: not found`**

This is a symptom of the install step having failed. The `if: always()` on `kernel:stop` means it tries to run even after install failure. Fix the install step; `kernel:stop` will succeed in the next run.

**`pnpm run design-lint:snapshot-diff` fails in CI**

The baseline snapshot file (`ops/artifacts/snapshots/baseline.bin`) must be committed. If it doesn't exist or is corrupt, regenerate it:
```bash
pnpm run kernel:start
pnpm run design-lint:snapshot
cp ops/artifacts/build/kernel-snapshot.bin ops/artifacts/snapshots/baseline.bin
git add ops/artifacts/snapshots/baseline.bin
git commit -m "chore: update snapshot baseline"
```

**SARIF upload step fails with `Path does not exist`**

The `design-lint:sarif` step must run before the upload step and must create the output directory. The script uses `mkdir -p ops/artifacts/lint && design-lint … --output ops/artifacts/lint/report.sarif`. If the script itself failed, the file won't exist. Check the sarif step's output for the underlying lint error.

---

## Artifacts

**Artifacts look stale after a token change**

Run the full pipeline:
```bash
pnpm run kernel:stop && pnpm run kernel:start
pnpm run dtif:build
pnpm run dtif:diff
pnpm run dtif:audit
pnpm run dtif:dscp
```
Then commit all changes in `ops/artifacts/`.

**`dtif:diff` reports unexpected breaking changes**

A token was removed or had its `$type` changed. This is a breaking change because consumers referencing the old token would break. If intentional, update the baseline:
```bash
cp tokens/catalog.tokens.json ops/artifacts/diff/baseline.dtif.json
git add ops/artifacts/diff/baseline.dtif.json
```
