# tokens/

The single source of truth for all design decisions in this system.

---

## Directory layout

```
tokens/
  foundations.json        ← primitive values (edited by humans)
  catalog.tokens.json     ← aggregator (kept in sync, read by the kernel)
  components/
    button.json           ← button-specific tokens
  themes/
    dark.json             ← dark theme overrides
    light.json            ← light theme overrides (high-contrast variant)
```

---

## The two-file pattern

Two files hold essentially the same tokens, which surprises new readers.

**`foundations.json`** is the human-edited source. When you add or change a token, this is the file you edit first. It's split into logical groups: `clr` for colours, `spacing` for the spacing scale, `easing` for motion curves, etc.

**`catalog.tokens.json`** is the kernel's entry point. It inlines every token from `foundations.json`, `components/button.json`, and the theme override files into one file. The DSR kernel reads this file at startup. It also acts as a comprehensive review artifact — a PR reviewer can see the full token catalog in one place.

**Why keep them in sync manually?** An automated sync would hide structural changes from PR reviewers. The manual requirement is intentional: adding a token is a design decision that should be reviewed explicitly.

**What breaks if they're out of sync?** The kernel reads the catalog. A token in `foundations.json` but missing from `catalog.tokens.json` won't be enforced by any lint rule. `dtif:validate` will catch the discrepancy.

---

## Token naming convention

Tokens are grouped by design concept. Group names use camelCase; token names within a group use camelCase too.

| Group | Contains |
|---|---|
| `clr` | Colours |
| `spacing` | Padding, margin, gap scale |
| `fontSizes` | Type size scale |
| `fontWeights` | Font weight values |
| `fonts` | Font family definitions |
| `lineHeights` | Leading values |
| `letterSpacings` | Tracking values |
| `radius` | Border radius scale |
| `durations` | Transition/animation timings |
| `easing` | Cubic bezier curves |
| `shadows` | Box shadows |
| `opacity` | Transparency levels |
| `outlines` | Focus outlines |
| `blurs` | Filter blur values |
| `borderWidths` | Border widths |
| `zIndex` | Stacking order |
| `animations` | CSS animation shorthands |
| `cmp` | Component-scoped tokens (in components/*.json) |

---

## The sorting requirement

All sibling keys within a token group must be in case-insensitive lexicographic (alphabetical) order. This applies at every level.

**Valid:**
```json
"spacing": {
  "lg": { … },
  "md": { … },
  "sm": { … }
}
```

**Invalid:**
```json
"spacing": {
  "sm": { … },
  "md": { … }
}
```

If you violate the sort, `pnpm run dtif:validate` will report exactly which group is out of order:
```
collection members must be sorted lexicographically (#/spacing)
```

Note: case-insensitive means `durationVars` sorts after `durations` (because `v` > `s`), and `fontSizes` sorts before `fontWeights` sorts before `fonts`.

---

## Adding a token group

1. Add the new group to `foundations.json` in alphabetical order relative to existing groups
2. Add the same group to `catalog.tokens.json`
3. Run `pnpm run dtif:validate` to confirm the sort order is correct
4. Restart the kernel: `pnpm run kernel:stop && pnpm run kernel:start`

---

## The `$deprecated` field

Mark a token as deprecated by adding:
```json
"$deprecated": { "$replacement": "#/path/to/replacement" }
```

The `$replacement` value is a JSON Pointer to the token that should be used instead. The `design-system/deprecation` lint rule will flag any code that references the deprecated token path by string literal.

See [docs/governance.md](../docs/governance.md) for the full deprecation lifecycle.

---

## Further reading

- [docs/token-system.md](../docs/token-system.md) — types, naming, CSS var generation
- [docs/governance.md](../docs/governance.md) — ownership and audit enforcement
- [docs/theming.md](../docs/theming.md) — how `$overrides` and `$when` work
- [docs/how-to-add-a-token.md](../docs/how-to-add-a-token.md) — step-by-step procedure
