# src/

Example UI components that consume design tokens. This is intentionally minimal — one component, one app shell — to keep the focus on the token pipeline rather than the component library.

---

## What's here

```
src/
  App.jsx               ← entry point; assembles components
  components/
    Button.jsx          ← primary example component
    button.css          ← canonical stylesheet (what Button imports)
    button.scss         ← SCSS variant (demonstrates SCSS linting)
    button.less         ← Less variant (demonstrates Less linting)
```

---

## Why three stylesheets for one component?

`button.css` is the **canonical stylesheet** — it's the one imported by `Button.jsx`. The `.scss` and `.less` files exist to demonstrate that design-lint's token rules apply equally to all three stylesheet formats. design-lint uses the PostCSS SCSS parser for `.scss` files and the PostCSS Less parser for `.less` files.

If you're adding a new component, a single `.css` file is all you need.

---

## How Button.jsx consumes tokens

`Button.jsx` uses CSS classes, not inline styles:

```jsx
<button type="button" className={className} …>
```

The CSS classes are defined in `button.css`, which imports the generated token CSS and references variables:

```css
@import '../../ops/artifacts/build/tokens.css';

.button-primary {
  background-color: var(--catalog-tokens-cmp-btn-bg);
  font-size: var(--foundations-font-sizes-base);
  font-weight: 600;  /* matches fontWeights.semibold token */
  …
}
```

**Why not inline styles?** The `design-system/no-inline-styles` rule is configured to error on any `style` prop on the `Button` component. CSS classes are the correct pattern — they allow design-lint to validate the declared values against the token catalog.

---

## The `design-lint-disable` comments

Two suppression comments appear in this directory — both are intentional and documented.

**`Button.jsx` — suppresses `design-system/component-usage`:**
```jsx
// design-lint-disable-next-line design-system/component-usage
<button type="button" …>
```
`component-usage` is configured to flag `<button>` elements and suggest using the `Button` design system component instead. But `Button.jsx` *is* the design system component — suppressing the rule on its own implementation is correct. A consumer file using `<button>` without this suppression would still be flagged.

**`App.jsx` — suppresses `design-system/component-prefix`:**
```jsx
{/* design-lint-disable design-system/component-prefix */}
<Button>Legacy entry</Button>
{/* design-lint-enable design-system/component-prefix */}
```
`component-prefix` is configured to require a `DS` prefix on design system components (e.g. `DSButton`). This suppression demonstrates the block-disable syntax. In a real project, this would be a documented exception for a legacy entry point during a migration period.

---

## How App.jsx demonstrates lint suppression

`App.jsx` shows all three forms of inline suppression in one file:
- Block disable/enable (for the legacy entry point)
- No other suppressions — the primary Button usages pass all rules

---

## Adding a new component

Follow [docs/how-to-add-a-component.md](../docs/how-to-add-a-component.md) for the full procedure. The short version:

1. Create `src/components/YourComponent.jsx` and `your-component.css`
2. Import `../../ops/artifacts/build/tokens.css` in the CSS
3. Use `var(--catalog-tokens-*)` for colors and `var(--foundations-*)` for spacing/typography
4. Run `pnpm run verify` and fix any errors
