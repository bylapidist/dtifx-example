# Getting Started

Pick the path that matches your role. Each path is self-contained — you don't need to read the others first.

- [I'm a designer](#im-a-designer)
- [I'm a developer](#im-a-developer)
- [I'm setting up CI / platform engineering](#im-setting-up-ci--platform-engineering)

---

## I'm a designer

You don't need to run any commands. This section explains what the files mean and how your decisions end up in code.

### Where your tokens live

Open `tokens/foundations.json`. Every entry is a design decision:

```json
"clr": {
  "brand": {
    "$type": "color",
    "$description": "Primary brand colour ensuring AA contrast on light backgrounds.",
    "$value": { "colorSpace": "srgb", "components": [0.055, 0.361, 0.678] }
  }
}
```

| Field | Meaning |
|---|---|
| `$type` | What kind of value: `color`, `dimension`, `duration`, `fontWeight`, … |
| `$description` | Human-readable explanation — this is what appears in the design system docs |
| `$value` | The actual value. Colors use sRGB (0–1 scale). `[0.055, 0.361, 0.678]` = `#0E5CAD` |
| `$extensions.lapidist.governance.owner` | Who is responsible for this token |

### How tokens reach components

```
Your decision            Token file            CSS                Component
"Brand blue = #0E5CAD" → clr.brand in JSON → --clr-brand: oklch(…) → background-color: var(--clr-brand)
```

1. You agree on a value (Figma, brand guidelines, spreadsheet)
2. A developer adds it to `tokens/foundations.json`
3. `pnpm run dtif:build` generates `ops/artifacts/build/tokens.css`
4. Every component imports that CSS file — the variable is now available everywhere
5. `design-lint` enforces that nobody hard-codes `#0E5CAD` instead of the variable

### What DESIGN_SYSTEM.md is

`DESIGN_SYSTEM.md` is auto-generated from the token catalog. It lists every token with its current value and whether it's deprecated. Run `pnpm run dtif:dscp` to regenerate it after any token change.

### Reading governance metadata

Each token can carry governance information:

```json
"$extensions": {
  "lapidist.governance": {
    "owner": "Design Foundations Guild",
    "reviewCadence": "quarterly",
    "sla": "5 business days"
  },
  "lapidist.accessibility": {
    "contrastTarget": "AA"
  }
}
```

This is enforced by the audit step in CI — if a token is missing an owner, the audit fails.

### Dark mode and high-contrast

Theme overrides live in `tokens/themes/dark.json` and `tokens/themes/light.json`. Each override uses `$when` conditions:

```json
{ "$token": "#/cmp/btn/bg", "$when": { "theme": "dark" }, "$value": { … } }
```

The dark-theme button background is lighter than the light-theme one — both are defined here, and design-lint checks that both meet contrast requirements.

---

## I'm a developer

### Prerequisites

- Node.js 24+ (`node --version`)
- pnpm 10+ (`pnpm --version`) — install with `npm install -g pnpm`

### First run

```bash
git clone https://github.com/bylapidist/dtifx-example.git
cd dtifx-example
pnpm install          # installs dependencies + builds preset configs
pnpm run kernel:start # starts the DSR kernel (loads tokens into memory)
pnpm run verify       # ESLint + design-lint — should exit 0
```

Expected output from `pnpm run verify`:
```
[OK] src/components/Button.jsx
[OK] src/components/button.css
… (warnings about unused tokens are expected — not errors)
0 errors
```

### How linting works

`design-lint` needs the **DSR kernel** running — a background process that holds all tokens in memory. Without it, linting fails with a connection error.

```bash
pnpm run kernel:status  # check if it's running
pnpm run kernel:stop    # stop it
pnpm run kernel:start   # restart it (picks up config changes)
```

The kernel reads tokens from `tokens/catalog.tokens.json` at startup. Any change to token files requires a kernel restart to take effect.

### Making a change

**Changing a token value:**
1. Edit the value in `tokens/foundations.json` and `tokens/catalog.tokens.json` (keep them in sync)
2. `pnpm run kernel:stop && pnpm run kernel:start` — reload the kernel
3. `pnpm run verify` — confirm lint passes
4. `pnpm run dtif:build` — regenerate CSS and JSON artifacts
5. `pnpm run dtif:diff` — review what changed vs. baseline
6. Commit everything including `ops/artifacts/`

**Adding a new token:** follow [docs/how-to-add-a-token.md](docs/how-to-add-a-token.md).

**Editing a component:**
1. Edit `src/components/Button.jsx` or `src/components/button.css`
2. `pnpm run verify` — must pass before committing
3. If you use a raw color (`#0E5CAD`) instead of `var(--catalog-tokens-clr-brand)`, lint will fail — that's by design

### Understanding the CSS variables

Tokens from `tokens/catalog.tokens.json` become CSS custom properties with the source file as prefix:

```
tokens/catalog.tokens.json → --catalog-tokens-clr-brand: oklch(…)
tokens/foundations.json    → --foundations-clr-brand: oklch(…)
tokens/components/button.json → --button-cmp-btn-bg: oklch(…)
```

Use the `--catalog-tokens-*` variants in components — they aggregate everything.

### Inline lint suppression

To suppress a rule on one line (e.g. an intentional exception):

```css
animation: spin 1s linear infinite; /* design-lint-disable-line design-token/animation */
```

To suppress a block:
```jsx
{/* design-lint-disable design-system/component-prefix */}
<Button>Legacy</Button>
{/* design-lint-enable design-system/component-prefix */}
```

---

## I'm setting up CI / platform engineering

### What the pipeline does

The CI workflow (`.github/workflows/ci.yml`) runs these steps in order:

| Step | Command | What it checks |
|---|---|---|
| Start kernel | `kernel:start` | Loads tokens into memory for all lint steps |
| Validate config | `design-lint:validate` | Config file syntax, plugin loading, rule names |
| Lint | `verify` | ESLint + all design-lint rules against source files |
| Warning budget | `design-lint:check` | Fails if warnings exceed 100 (enforces gradual improvement) |
| SARIF export | `design-lint:sarif` | Produces SARIF for GitHub code scanning |
| Validate tokens | `dtif:validate` | DTIF schema conformance of all token files |
| Build artifacts | `dtif:build` | Regenerates CSS and JSON from token sources |
| Diff baseline | `dtif:diff` | Compares current tokens against the committed baseline |
| Audit policies | `dtif:audit` | Governance checks (required owners, review cadence) |

### The warning budget

`design-lint:check` runs `--fail-on-empty --max-warnings 100`. If any lint target resolves to zero files, or if total warnings exceed 100, CI fails. This prevents silently skipping lint and caps accumulated warnings.

### The diff baseline

`ops/artifacts/diff/baseline.dtif.json` is the committed snapshot of approved tokens. When `dtif:diff` runs, it compares the current `tokens/catalog.tokens.json` against this file. Breaking changes (removed tokens, changed types) are highlighted. After reviewing, update the baseline:

```bash
cp tokens/catalog.tokens.json ops/artifacts/diff/baseline.dtif.json
git add ops/artifacts/diff/baseline.dtif.json
git commit -m "chore: update diff baseline"
```

### The kernel snapshot baseline

`ops/artifacts/snapshots/baseline.bin` is a binary snapshot of the kernel's token graph. `design-lint:snapshot-diff` exports the current graph and diffs against this file, detecting token additions/removals between runs.

### Adding design-lint to an existing project

1. `pnpm add --save-dev @lapidist/design-lint`
2. `pnpm exec design-lint init` — generates a starter `designlint.config.json`
3. `pnpm exec design-lint kernel start --config-path designlint.config.json`
4. `pnpm exec design-lint "src/**/*" --fail-on-empty` — establish your baseline
5. Copy the relevant CI steps from `.github/workflows/ci.yml` into your pipeline

Start rules at `warn` severity and promote to `error` as your team adopts the system. See [configuration-presets.md in the design-lint docs](https://github.com/bylapidist/design-lint/blob/main/docs/configuration-presets.md) for `recommended` and `strict` presets.

### Governance enforcement

`designlint.policy.json` defines hard constraints that apply to every consumer config:

```json
{
  "requiredRules": ["design-token/colors", "design-token/spacing"],
  "minSeverity": { "design-token/colors": "error" },
  "ratchet": { "mode": "entropy", "minScore": 80 }
}
```

`ratchet` prevents entropy from increasing — if a PR introduces new violations, CI fails even if total count stays the same. `minScore: 80` means the design system health score must stay above 80/100.
