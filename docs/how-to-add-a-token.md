# How to add, modify, or deprecate a token

This guide walks through the full lifecycle of a design token in this repository.

---

## Before you start

Decide which category your token belongs to:

| Category | File | Use when |
|---|---|---|
| **Foundation** | `tokens/foundations.json` | Primitive value with no component context: a colour, a spacing scale step, a font weight |
| **Component** | `tokens/components/button.json` | Value specific to one component: the button's background colour |
| **Theme override** | `tokens/themes/dark.json` | A value that changes in a particular context (dark mode, high-contrast) |

Foundation tokens should not reference component concepts. Component tokens may reference foundation values.

---

## Adding a new foundation token

### 1. Choose a group and name

Token paths follow the pattern `group.name`. Groups are named after the design concept:

| Group | What goes here |
|---|---|
| `clr` | Colours |
| `spacing` | Padding, margin, gap values |
| `fontSizes` | Type scale sizes |
| `fontWeights` | Font weight values |
| `radius` | Border radius values |
| `durations` | Transition / animation timings |
| `easing` | Cubic bezier curves |
| `shadows` | Box shadow definitions |
| `opacity` | Opacity levels |
| `outlines` | Outline shorthand strings |
| `blurs` | Blur filter values |
| `zIndex` | Stacking order values |

Pick the matching group, or create a new one using the same `$description` pattern.

### 2. Write the token in `tokens/foundations.json`

Add it inside the appropriate group, sorted alphabetically by key:

```json
"spacing": {
  "lg": { … },
  "md": { … },
  "sm": {
    "$type": "dimension",
    "$description": "Small spacing unit for tight layouts.",
    "$value": { "dimensionType": "length", "value": 8, "unit": "px" },
    "$extensions": {
      "lapidist.governance": {
        "owner": "Design Foundations Guild",
        "reviewCadence": "quarterly",
        "sla": "5 business days"
      }
    }
  }
}
```

**Sorting matters** — the DTIF schema requires keys to be in case-insensitive lexicographic order. `sm` comes after `md` because `s` > `m`.

### 3. Mirror it in `tokens/catalog.tokens.json`

`catalog.tokens.json` is the inline aggregation of all sources. Add the same token object in the matching group. The catalog and foundations must stay in sync — if they diverge, the kernel and the build will show different token sets.

### 4. Validate the token files

```bash
pnpm run dtif:validate
```

This checks the DTIF schema. Fix any errors before continuing.

### 5. Reload the kernel

```bash
pnpm run kernel:stop
pnpm run kernel:start
```

The kernel reads tokens at startup. Changes don't take effect until you restart.

### 6. Build the CSS and JSON artifacts

```bash
pnpm run dtif:build
```

Check `ops/artifacts/build/tokens.css` — your new token should appear as a CSS custom property:
```css
--foundations-spacing-sm: 8px;
```

### 7. Use the token in a component

Reference the generated CSS variable:
```css
.some-element {
  margin: var(--foundations-spacing-sm);
}
```

design-lint validates that `var()` references correspond to registered tokens. A typo in the variable name will be caught.

### 8. Run verify

```bash
pnpm run verify
```

Must exit 0 before committing.

### 9. Check the diff

```bash
pnpm run dtif:diff
```

Review the change report in `ops/artifacts/diff/report.json`. New tokens appear as additions — verify they're correct.

### 10. Commit everything

Commit **both** source files and artifacts in the same PR:

```bash
git add tokens/ ops/artifacts/
git commit -m "feat(tokens): add spacing.sm (8px)"
```

---

## Modifying an existing token value

Follow the same steps as adding a token, but edit the existing `$value` rather than adding a new entry. Pay attention to:

- **Type consistency** — you can't change `$type` (e.g., `color` to `dimension`). If the type needs to change, deprecate the old token and add a new one.
- **Downstream impact** — if the value changes, all components using it will render differently. Run `dtif:diff` and review carefully.

---

## Deprecating a token

Mark the token with `$deprecated` pointing to its replacement:

```json
"pad": {
  "$type": "dimension",
  "$deprecated": { "$replacement": "#/cmp/btn/padding" },
  "$value": { "dimensionType": "length", "value": 16, "unit": "px" },
  …
}
```

Add the replacement token alongside it. Leave the deprecated token in place — it will be caught by the `design-system/deprecation` lint rule if any code still references it.

To mark it deprecated in the running kernel without restarting:
```bash
pnpm run kernel:token-deprecate
# (edit the script in package.json to point to your token's pointer)
```

---

## Token type reference

| `$type` | `$value` shape | CSS output |
|---|---|---|
| `color` | `{ colorSpace: "srgb", components: [R, G, B] }` | `oklch(…)` |
| `dimension` (length) | `{ dimensionType: "length", value: N, unit: "px"\|"rem" }` | `Npx` or `Nrem` |
| `dimension` (custom) | `{ dimensionType: "custom", value: N, unit: "…" }` | Not emitted as CSS var |
| `duration` | `{ durationType: "css.transition-duration", value: N, unit: "ms"\|"s" }` | Not emitted as CSS var |
| `fontWeight` | `400` (number) | Not emitted as CSS var |
| `fontFamily` | `"Inter"` (string) | Not emitted as CSS var |
| `cubicBezier` | `"cubic-bezier(0.4, 0, 0.2, 1)"` (string) | Not emitted as CSS var |
| `number` | `1.25` (number) | Not emitted as CSS var |
| `string` | `"2px solid transparent"` (string) | Not emitted as CSS var |
| `shadow` | `{ shadowType, offsetX, offsetY, blur, spread, color }` | Not emitted as CSS var |

**Which types emit CSS variables?** Only `color` and `dimension` with `dimensionType: "length"`. All other types are available to design-lint rules via the kernel but do not appear in `tokens.css`. Use raw CSS values that match the token (e.g., `font-weight: 600` instead of a var) for these types — design-lint validates them via value-equivalence mode.

---

## Common errors

**"collection members must be sorted lexicographically"**
Your new key is out of order. Tokens within a group must be sorted case-insensitively. Move the entry to the right alphabetical position.

**"Token file paths must be relative and end with .tokens.json"**
The `tokens.default` field in `designlint.config.js` must point to a `.tokens.json` file. Our catalog is already named `catalog.tokens.json` — check your path.

**Lint rule fires on new token's value in CSS**
Ensure the CSS value exactly matches the token's value as it would appear in the kernel. For `dimension` types, the match is in pixels (`0.05rem` normalises to `0.8px`). For `number` types, the match is the raw number (`1.25`).
