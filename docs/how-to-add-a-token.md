# How to add, modify, or deprecate a token

---

## Start with the concept — which layer does this belong in?

Use this decision tree before touching any file:

```
Is the value used by multiple components, or is it a primitive design decision
(a colour from the palette, a step in the spacing scale, a font size)?
  YES → Foundation token (tokens/foundations.json)

Is the value specific to one component and only makes sense in that context?
  YES → Component token (tokens/components/yourcomponent.json)

Is the value the same as an existing token in most contexts but different
in dark mode, high-contrast mode, or another theme variant?
  YES → Theme override (tokens/themes/dark.json or light.json)
```

**Examples:**
- `clr.brand` → Foundation (the brand colour is used everywhere)
- `cmp.btn.bg` → Component (the button background is a button concept)
- `cmp.btn.bg` in dark mode → Theme override (same token, different value in dark context)

---

## The governance requirement

Every new token **must** include governance metadata. Do not add a token without it — `dtif:audit` will flag it as a missing owner, and CI will warn.

Copy this template (adjust for component vs. foundation tier):

**Foundation tokens** — owned by the Design Foundations Guild:
```json
"$extensions": {
  "lapidist.governance": {
    "owner": "Design Foundations Guild",
    "reviewCadence": "quarterly",
    "sla": "5 business days"
  }
}
```

**Component tokens** — owned by the Design Systems Guild:
```json
"$extensions": {
  "lapidist.governance": {
    "owner": "Design Systems Guild",
    "reviewCadence": "monthly",
    "sla": "3 business days"
  }
}
```

---

## The sorting requirement

Keys within a group must be in **case-insensitive alphabetical order**. Place your new token in the correct position before writing any other fields. If you sort incorrectly, `dtif:validate` will catch it — but it's faster to get it right immediately.

```json
"spacing": {
  "lg": { … },
  "md": { … },
  "sm": { … }   ← new token: 'sm' comes after 'md', before nothing. Correct.
}
```

---

## Step 1: Write the token in the source file

Add the token to `tokens/foundations.json` (or `tokens/components/yourcomponent.json`):

```json
"spacing": {
  "lg": { … },
  "md": { … },
  "sm": {
    "$type": "dimension",
    "$description": "Small spacing unit for compact layouts.",
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

See the [token type reference](#token-type-reference) below for the correct `$value` shape for each type.

---

## Step 2: Mirror in `catalog.tokens.json`

Add the identical token object in the same group position in `catalog.tokens.json`. The catalog is the kernel's entry point — if a token is in `foundations.json` but not in the catalog, the linter won't see it.

---

## Step 3: Validate

```bash
pnpm run dtif:validate
```

Fix any errors before continuing. Common errors: sort order violations, missing `shadowType` in shadow values, unrecognised `$type`.

---

## Step 4: Reload the kernel

The kernel reads `catalog.tokens.json` at startup and does not watch for changes. Any token you just added won't be enforced until you restart:

```bash
pnpm run kernel:stop && pnpm run kernel:start
```

---

## Step 5: Build and use the token

```bash
pnpm run dtif:build
```

Check `ops/artifacts/build/tokens.css` — if your token is a `color` or `dimension(length)` type, it will appear as a CSS custom property:
```css
--foundations-spacing-sm: 8px;
--catalog-tokens-spacing-sm: 8px;
```

Use it in a component stylesheet:
```css
.compact { padding: var(--foundations-spacing-sm); }
```

For types that don't emit CSS vars (font-weight, line-height, opacity, etc.), use the raw value directly in CSS — design-lint validates it via value-equivalence:
```css
.text { font-weight: 600; } /* passes if fontWeights.semibold = 600 */
```

---

## Step 6: Verify

```bash
pnpm run verify
```

Must exit 0. If a rule fires about the new token value being invalid, check that the CSS value exactly matches the token's resolved value (for dimension types: same number and unit).

---

## Step 7: Check the diff

```bash
pnpm run dtif:diff
```

Your new token should appear as an addition. Review `ops/artifacts/diff/report.json` to confirm only the expected changes are present.

---

## Step 8: Commit everything

Commit source files and artifacts in the same commit:
```bash
git add tokens/ ops/artifacts/
git commit -m "feat(tokens): add spacing.sm (8px)"
```

---

## Modifying an existing token value

Same steps as adding, but edit the existing `$value` instead of adding a new entry. Pay attention to:

- **Type consistency** — you cannot change `$type`. If the type needs to change, deprecate the old token and add a new one.
- **Downstream impact** — any component using this token will render differently. Run `dtif:diff` and review carefully.
- **Both files** — change the value in both `foundations.json` and `catalog.tokens.json`.

---

## Deprecating a token

**Step 1: Mark it deprecated**
```json
"pad": {
  "$type": "dimension",
  "$deprecated": { "$replacement": "#/cmp/btn/padding" },
  "$value": { "dimensionType": "length", "value": 16, "unit": "px" },
  …
}
```

**Step 2: Add the replacement token** alongside it with the same or updated value.

**Step 3: Mirror in catalog** — add `$deprecated` to the catalog copy too.

**Step 4: Let the linter catch usages** — `design-system/deprecation` (warn) flags string literal references to the deprecated pointer.

**Step 5: Remove** in a later PR once all usages are confirmed gone.

---

## Token type reference

| `$type` | `$value` shape | CSS var emitted? |
|---|---|---|
| `color` | `{ colorSpace: "srgb", components: [R, G, B] }` | ✅ as `oklch(…)` |
| `dimension` (length) | `{ dimensionType: "length", value: N, unit: "px"\|"rem" }` | ✅ as `Npx` or `Nrem` |
| `dimension` (custom) | `{ dimensionType: "custom", value: N, unit: "…" }` | ❌ |
| `duration` | `{ durationType: "css.transition-duration", value: N, unit: "ms"\|"s" }` | ❌ |
| `fontWeight` | `400` (number) | ❌ |
| `fontFamily` | `"Inter"` (string) | ❌ |
| `cubicBezier` | `"cubic-bezier(0.4, 0, 0.2, 1)"` (string) | ❌ |
| `number` | `1.25` (number) | ❌ |
| `string` | `"2px solid transparent"` (string) | ❌ |
| `shadow` | `{ blur, color, offsetX, offsetY, shadowType, spread }` (keys alphabetical) | ❌ |

For types that don't emit CSS vars, use raw CSS values that match the token and design-lint validates them via value-equivalence mode.

---

## Common errors

**`collection members must be sorted lexicographically`**
A key is out of alphabetical order. Move it to the correct position (case-insensitive comparison).

**`must have required property 'shadowType'`**
Shadow `$value` objects require `shadowType: "css.box-shadow"`. Keys must also be in alphabetical order: `blur`, `color`, `offsetX`, `offsetY`, `shadowType`, `spread`.

**`canonical key order violated`**
Dimension `$value` keys must be in the order `dimensionType`, `value`, `unit` (not alphabetical for this specific type).

**Token passes linting when I expect it to fail**
The kernel wasn't restarted after you edited the token files. Restart it: `pnpm run kernel:stop && pnpm run kernel:start`.

**design-lint rule fires on raw value**
The CSS value doesn't exactly match the token's resolved value. For dimension tokens, check both number and unit. For color tokens, compute the sRGB components correctly (0–1 scale, not 0–255).
