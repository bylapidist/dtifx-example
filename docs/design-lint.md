# design-lint

How the linter works, what each rule category does, and when (and when not) to suppress violations.

---

## What design-lint does

design-lint checks your CSS, SCSS, Less, and JSX/TSX source files against the registered design tokens. It answers the question: **"Does this code use only approved design decisions?"**

A hard-coded `color: #0E5CAD` in CSS fails. `color: var(--catalog-tokens-clr-brand)` passes. `font-weight: 600` passes if `fontWeights.semibold = 600` is a registered token. `font-weight: 500` fails if 500 is not a token.

---

## Why design-lint needs a running kernel

design-lint does not read token files directly at lint time. Instead, it queries the **DSR kernel** — a long-lived daemon that holds the full token graph in memory. This architecture means:

- Lint invocations are fast (no file parsing per run)
- The kernel can answer rich queries via DSQL (e.g. "is this rgba value equivalent to any registered shadow token?")
- Token data is consistent across all tools (linter, LSP, MCP server) because they all query the same kernel

**Consequence:** The kernel must be running before any `design-lint` command. If it isn't, you'll see a connection refused error. If it was started with stale tokens, the linter will validate against the old token set.

```bash
pnpm run kernel:start   # start and seed with catalog.tokens.json
pnpm run kernel:status  # check it's running
pnpm run kernel:stop    # stop it
```

After any token file change, restart the kernel to pick up the new values.

---

## Rule categories

### `design-token/*` — require registered token values

These rules check that raw CSS values (colors, spacing, durations, etc.) match a token registered in the kernel. They operate in **value-equivalence mode** by default: a raw value is allowed if it matches a token's value exactly.

For types that emit CSS vars (colors, dimensions), use `var(--...)` references — they are always allowed by design-token rules without matching. For types that don't emit CSS vars (font-weight, line-height, opacity, etc.), use raw values that match the token: `font-weight: 600` passes if `fontWeights.semibold = 600`.

| Rule | Checks | Token group required |
|---|---|---|
| `design-token/colors` | Color values in CSS | any `color` type token |
| `design-token/spacing` | Dimension values across all properties | `spacing` group |
| `design-token/duration` | Transition/animation durations | `durations` group |
| `design-token/easing` | `cubic-bezier()` timing functions | `easing` group |
| `design-token/font-family` | `font-family` values | `fonts` group |
| `design-token/font-size` | `font-size` values | `fontSizes` group |
| `design-token/font-weight` | `font-weight` values | `fontWeights` group |
| `design-token/line-height` | `line-height` values | `lineHeights` group |
| `design-token/letter-spacing` | `letter-spacing` values | `letterSpacings` group |
| `design-token/border-radius` | `border-radius` values | `radius` group |
| `design-token/border-width` | `border-width` values | `borderWidths` group |
| `design-token/border-color` | `border-color` values | any `color` type |
| `design-token/box-shadow` | `box-shadow` values | `shadows` group |
| `design-token/outline` | `outline` values | `outlines` group |
| `design-token/opacity` | `opacity` values | `opacity` group |
| `design-token/z-index` | `z-index` values | `zIndex` group |
| `design-token/animation` | `animation` shorthand | `animations` group |
| `design-token/blur` | `filter: blur()` values | `blurs` group |
| `design-token/composite-equivalence` | Raw composite values matching a composite token | any composite token |
| `design-token/css-var-provenance` | `var(--...)` references backed by tokens | all registered tokens |

**Note on `css-var-provenance`:** This rule is set to `warn` in this repo. See [docs/architecture.md](architecture.md#why-is-design-tokencssvarprovenance-set-to-warn-not-error) for why.

### `design-system/*` — enforce component and structure conventions

These rules check how components are structured, imported, and used. Most of these rules do not require token seeding — they operate on AST structure alone.

| Rule | Checks | Severity |
|---|---|---|
| `no-inline-styles` | `style` prop on design system components | error |
| `jsx-style-values` | Raw values in JSX `style` objects | error (ai-agent) |
| `no-hardcoded-spacing` | Hardcoded spacing/sizing in JSX and CSS | error (ai-agent) |
| `component-usage` | Raw HTML elements where DS components should be used | warn |
| `component-prefix` | DS component names missing the required prefix | warn |
| `icon-usage` | Raw `<svg>` elements where Icon component should be used | warn |
| `import-path` | DS components imported from wrong packages | warn |
| `variant-prop` | Invalid variant prop values | warn |
| `deprecation` | Usage of deprecated token paths | warn |
| `no-unused-tokens` | Registered tokens never referenced in linted files | warn |

### Custom plugin rule: `dtifx/no-hardcoded-color-values`

Defined in `ops/plugins/dtifx-rules.js`. Flags raw color literals on CSS color properties when registered tokens are available. Demonstrates the plugin API but is not enabled in `rules:` by default (adding it would conflict with `design-token/colors`).

---

## Inline lint suppression

Sometimes a violation is intentional — a legacy exception, a third-party value, or an architectural trade-off. Use inline suppression with a mandatory comment explaining why.

### Suppress one line (next line)
```jsx
// design-lint-disable-next-line design-system/component-usage
<button type="button">…</button>
```

### Suppress one line (end of line)
```css
animation: spin 1s linear infinite; /* design-lint-disable-line design-token/animation, design-token/duration */
```

Multiple rules can be suppressed on one line, comma-separated.

### Suppress a block
```jsx
{/* design-lint-disable design-system/component-prefix */}
<Button>Legacy</Button>
{/* design-lint-enable design-system/component-prefix */}
```

### When suppression is appropriate

✅ **Appropriate:**
- Implementing a design system component itself (e.g., `Button.jsx` wraps `<button>` — suppressing `component-usage` on its own implementation)
- A documented legacy exception with a ticket reference and plan to remove
- A value from a third-party library or browser default that is intentionally not tokenised

❌ **Inappropriate:**
- Working around a violation you don't understand
- Suppressing to make CI pass without fixing the underlying issue
- Suppressing without a comment explaining why

**Always add a comment explaining the reason** when suppressing. Future readers (and future you) will need to know whether the suppression is still valid.

---

## The `designlint.policy.json` file

The policy file adds governance constraints on top of the per-project config. Consumers cannot weaken a policy:

```json
{
  "requiredRules": ["design-token/colors", "design-token/spacing"],
  "minSeverity": { "design-token/colors": "error" },
  "ratchet": { "mode": "entropy", "minScore": 80 },
  "agentPolicy": {
    "maxViolationRate": 20,
    "requiredConvergence": true,
    "trustedAgents": ["claude"]
  }
}
```

- **`requiredRules`** — rules that must be configured in any consumer config
- **`minSeverity`** — floor severity that config cannot lower below
- **`ratchet`** — prevents new violations from being introduced; entropy score must stay ≥ 80
- **`agentPolicy`** — constraints applied to AI-generated code sessions; `trustedAgents` lists agents whose output is exempt from `requiredConvergence`
