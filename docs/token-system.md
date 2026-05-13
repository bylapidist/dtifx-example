# The Token System

This document explains the mental model behind how tokens are organised, what they produce, and how they flow through the pipeline.

---

## The three-layer hierarchy

Tokens are organised in three conceptual layers:

```
Layer 1: Foundation tokens     tokens/foundations.json
         Primitive values with no component context.
         Who uses this? Designers and the whole system.
         Examples: clr.brand, spacing.md, fontSizes.base

         │
         ▼

Layer 2: Component tokens      tokens/components/button.json
         Values scoped to a specific component.
         These may echo foundation values or diverge.
         Examples: cmp.btn.bg, cmp.btn.pad

         │
         ▼

Layer 3: Theme overrides       tokens/themes/dark.json
         Conditional replacements for specific contexts.
         Applied when $when conditions match at runtime.
         Examples: cmp.btn.bg in dark theme
```

### When to use each layer

| Situation | Layer |
|---|---|
| A colour used across the whole product | Foundation |
| A spacing value from the design scale | Foundation |
| The exact background of one specific component | Component |
| A value that changes in dark mode | Theme override |
| A value that changes at high-contrast accessibility level | Theme override |

**Rule of thumb:** If the token could theoretically be used by more than one component, it belongs in foundations. If it only makes sense in the context of one component, it belongs in that component's file.

---

## Token types

Each token has a `$type` that determines what it represents and how the build processes it.

| `$type` | What it represents | Emits CSS var? | CSS output format |
|---|---|---|---|
| `color` | An sRGB colour | ✅ Yes | `oklch(L C H)` |
| `dimension` (length) | A length value in `px` or `rem` | ✅ Yes | `Npx` or `Nrem` |
| `dimension` (custom) | A typed scalar (e.g. duration in ms) | ❌ No | — |
| `duration` | A CSS transition/animation duration | ❌ No | — |
| `fontWeight` | A font weight number | ❌ No | — |
| `fontFamily` | A font family name | ❌ No | — |
| `cubicBezier` | A CSS timing function | ❌ No | — |
| `number` | A unitless number (line-height, opacity, z-index) | ❌ No | — |
| `string` | An arbitrary CSS shorthand (outline, animation) | ❌ No | — |
| `shadow` | A box-shadow descriptor | ❌ No | — |

**Why don't all types emit CSS vars?** The DTIFx build's `css.variables` formatter only knows how to serialise types that have a clear CSS representation. `fontWeight` is a number in CSS (`600`) but CSS has no way to declare a "font weight custom property" that browsers understand as a font weight — `var(--font-weight-semibold)` works in CSS, but the value would be `600` (a plain number), which is already what you'd hardcode. For these types, design-lint validates raw CSS values in value-equivalence mode: if your CSS contains `font-weight: 600` and the kernel has a `fontWeights.semibold = 600` token, the rule passes.

---

## How CSS variable names are derived

The build processes each source file with a **stem prefix** based on the filename (without extension):

```
tokens/catalog.tokens.json   →  stem: catalog-tokens
tokens/foundations.json       →  stem: foundations  
tokens/components/button.json →  stem: button
```

Within each file, the token path (dot-separated group and name) is appended:

```
catalog.tokens.json, token path cmp.btn.bg  →  --catalog-tokens-cmp-btn-bg
foundations.json, token path spacing.md      →  --foundations-spacing-md
components/button.json, token path cmp.btn.pad → --button-cmp-btn-pad
```

**Which prefix to use in component stylesheets?**
- Use `--catalog-tokens-*` as the default — the catalog aggregates everything and is the most stable namespace.
- Use `--foundations-*` when you want to be explicit that you're referencing a primitive value (e.g. spacing scale, font size scale) rather than a component-specific token.
- Avoid `--button-*` outside the button component itself.

---

## The `$value` format for each type

### color
```json
"$value": {
  "colorSpace": "srgb",
  "components": [0.055, 0.361, 0.678]
}
```
Components are in 0–1 scale (not 0–255). Multiply by 255 to get the familiar `rgb()` values: `[14, 92, 173]` → `#0E5CAD`. The build outputs colors as `oklch()` for wide-gamut display support.

### dimension (length — emits CSS var)
```json
"$value": {
  "dimensionType": "length",
  "value": 16,
  "unit": "px"
}
```
Outputs as `16px` in the CSS file.

### dimension (custom — no CSS var)
```json
"$value": {
  "dimensionType": "custom",
  "value": 120,
  "unit": "duration.ms"
}
```
Used for values like durations that need a specific unit context but don't produce a CSS custom property.

### duration
```json
"$value": {
  "durationType": "css.transition-duration",
  "value": 120,
  "unit": "ms"
}
```
No CSS var. Used by `design-token/duration` rule: `transition: background-color 120ms ease` will be validated against this token.

### fontWeight
```json
"$value": 600
```
A plain number. No CSS var. Used by `design-token/font-weight` rule: `font-weight: 600` validates against this token.

### shadow
```json
"$value": {
  "shadowType": "css.box-shadow",
  "blur": { "dimensionType": "length", "value": 0, "unit": "px" },
  "color": { "colorSpace": "srgb", "components": [0.055, 0.361, 0.678, 0.4] },
  "offsetX": { "dimensionType": "length", "value": 0, "unit": "px" },
  "offsetY": { "dimensionType": "length", "value": 0, "unit": "px" },
  "spread": { "dimensionType": "length", "value": 3, "unit": "px" }
}
```
Keys must be in alphabetical order. The `color` field supports a 4th component for alpha. `shadowType` is required.

---

## The catalog sync requirement

`catalog.tokens.json` is a manually-maintained inline copy of every token from every source. When you add a token to `foundations.json`, you must also add it to `catalog.tokens.json` in the matching group.

**Why isn't this automated?** The catalog serves as an explicit, reviewable aggregation. An automated merge would hide structural changes from PR reviewers.

**What breaks if they're out of sync?**
- The kernel reads `catalog.tokens.json` at startup. A token in `foundations.json` but not in `catalog.tokens.json` won't be seen by the linter.
- `dtif:validate` compares the sources and will report a discrepancy.
- `dtif:diff` will show unexpected changes because the built `tokens.json` reflects all sources.

---

## The sorting requirement

The DTIF schema requires all sibling keys within a token group to be sorted in case-insensitive lexicographic order. This applies at every level: top-level groups, group members, and shadow `$value` sub-keys.

Example — valid ordering:
```json
"spacing": {
  "lg": { … },
  "md": { … },
  "sm": { … }
}
```

Example — invalid (violates sort):
```json
"spacing": {
  "sm": { … },
  "lg": { … }
}
```

If you violate the sort, `dtif:validate` will report:
```
collection members must be sorted lexicographically (#/spacing)
```

Case-insensitive means `durationVars` sorts after `durations` (because `v` > `s` when compared lowercase), and `fontSizes` sorts before `fontWeights` sorts before `fonts` (because `si` < `we` < `s` when truncated — actually `fonts` sorts after `fontSizes` and `fontWeights` because `s` alone is `s`, which is less than `si` in the next character comparison... the rule is standard string collation ignoring case).

When in doubt, run `pnpm run dtif:validate` — it will tell you exactly which group is out of order.
