# Theming

How dark mode and high-contrast variants work in this token system.

---

## How `$overrides` and `$when` work

DTIF theme overrides are declared in `tokens/themes/` files using the `$overrides` array. Each override specifies which token to replace, under what conditions, and with what value.

```json
{
  "$overrides": [
    {
      "$token": "#/cmp/btn/bg",
      "$when": { "theme": "dark" },
      "$value": {
        "colorSpace": "srgb",
        "components": [0.839, 0.871, 0.925]
      }
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `$token` | JSON Pointer to the token being overridden |
| `$when` | Conditions under which the override applies. A map of context keys to values. |
| `$value` | The replacement value. Same format as the original `$value`. |

The `$when` conditions are arbitrary key-value pairs. This repo uses `theme` and `accessibility` as context keys. Multiple conditions in a single `$when` object act as AND (all must match).

---

## Current themes

### Dark theme (`tokens/themes/dark.json`)
Overrides `cmp.btn.bg` and `cmp.btn.fg` when `{ "theme": "dark" }`:
- Button background becomes a light periwinkle (instead of deep blue) — the colour inversion maintains contrast on a dark canvas.
- Button foreground becomes near-black (instead of white) — dark text on the light button background.

### Light high-contrast (`tokens/themes/light.json`)
Overrides `cmp.btn.bg` and `cmp.btn.fg` when `{ "theme": "light", "accessibility": "high-contrast" }`:
- Button background deepens to a darker navy — stronger contrast than the default brand blue.
- Button foreground stays white.

These overrides live in separate theme files but are also inlined in `catalog.tokens.json` under `$overrides`.

---

## What the build does with overrides

The DTIFx `dtif:validate` step checks that every `$token` pointer in `$overrides` resolves to a real token in the catalog. Invalid pointers fail validation.

The `dtif:build` step **does not** apply overrides to the CSS output. The generated `tokens.css` contains only base values (`:root { --catalog-tokens-cmp-btn-bg: oklch(…); }`). Theme switching requires additional runtime tooling — this repo demonstrates the token authoring pattern, not a full runtime theme switcher.

To implement runtime theming you would generate separate `:root` and `[data-theme="dark"]` blocks from the overrides, typically using a custom formatter or a dedicated theme build step.

---

## Adding a new theme override

**Step 1: Decide which token to override**
Find its JSON Pointer: open `tokens/catalog.tokens.json`, navigate to the token, and note the path. A token at `cmp.btn.bg` has the pointer `#/cmp/btn/bg`.

**Step 2: Add the override to the relevant theme file**
```json
{
  "$overrides": [
    …existing overrides…,
    {
      "$token": "#/cmp/btn/bg",
      "$when": { "theme": "high-contrast-dark" },
      "$value": {
        "colorSpace": "srgb",
        "components": [0.9, 0.95, 1.0]
      }
    }
  ]
}
```

**Step 3: Mirror in `catalog.tokens.json`**
The catalog's `$overrides` array must also include the new override.

**Step 4: Validate**
```bash
pnpm run dtif:validate
```
An invalid pointer or malformed value will be caught here.

**Step 5: Build and check the diff**
```bash
pnpm run kernel:stop && pnpm run kernel:start
pnpm run dtif:build
pnpm run dtif:diff
```

---

## Adding a new theme from scratch

If you need a completely new context key (e.g. `{ "theme": "brand-b" }`):

1. Create `tokens/themes/brand-b.json` with the `$overrides` array.
2. Add the file path to `$extensions.lapidist.catalog.sources` in `catalog.tokens.json`.
3. Mirror the overrides in `catalog.tokens.json` under `$overrides`.
4. Add the new theme file to the `sources` array in `build/dtif-validate.config.mjs` and `build/dtif-build.config.mjs` if it needs to appear in validation and build output.
5. Run `dtif:validate` and `dtif:build` to confirm.

---

## Context metadata on tokens

Some tokens carry `$extensions.lapidist.context` metadata:

```json
"lapidist.context": {
  "surface": "canvas",
  "theme": "light"
}
```

This is informational — it documents which theme context the base value is designed for. It is not enforced by any tooling but appears in `DESIGN_SYSTEM.md` to help readers understand the intent.
