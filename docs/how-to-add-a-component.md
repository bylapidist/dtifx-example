# How to add a UI component

This guide walks through creating a new component that consumes design tokens correctly, passes all lint rules, and follows the conventions established by `src/components/Button`.

---

## Before you start: choosing token references

Decide upfront which tokens your component needs. Consult `DESIGN_SYSTEM.md` or run:
```bash
pnpm run design-lint:tokens --out /dev/stdout | python3 -m json.tool | grep '"name"'
```
to list every registered token name.

For most components you'll need:
- Background and foreground colors → `--catalog-tokens-cmp-*` or `--catalog-tokens-clr-*`
- Spacing → `--foundations-spacing-*` or `--foundations-radius-*`
- Typography → raw values that match `fontWeights`, `fontSizes`, `lineHeights` tokens

---

## Step 1: Create the component file

Put the component in `src/components/`. Use PascalCase for the filename:
```
src/components/Card.jsx
src/components/card.css
```

**Minimal JSX:**
```jsx
import './card.css';

export function Card({ children, title }) {
  return (
    <article className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-body">{children}</div>
    </article>
  );
}
```

---

## Step 2: Create the stylesheet

The stylesheet must import the generated token CSS file:
```css
@import '../../ops/artifacts/build/tokens.css';

.card {
  background-color: var(--catalog-tokens-clr-bg);
  border-radius: var(--foundations-radius-md);
  padding: var(--foundations-spacing-lg);
}

.card-title {
  color: var(--catalog-tokens-clr-brand);
  font-size: var(--foundations-font-sizes-base);
  font-weight: 600;        /* matches fontWeights.semibold */
  line-height: 1.25;       /* matches lineHeights.tight */
}
```

**Using CSS var references (`var(--...)`):**
- Always allowed by token rules — the rule doesn't check var contents
- Required for color and dimension tokens that emit CSS vars
- Use `--catalog-tokens-*` as the default namespace

**Using raw CSS values:**
For token types that don't emit CSS vars (font-weight, line-height, opacity, etc.), use the raw value that matches the token. Run `pnpm run design-lint:tokens` to confirm the expected value.

---

## Step 3: Run verify

```bash
pnpm run verify
```

Fix any errors before continuing. Common issues:

**`design-token/colors` error:** A raw hex or rgb color was used. Replace with `var(--catalog-tokens-clr-*)`.

**`design-token/spacing` error:** A raw pixel value was used in a spacing property. If the value matches a spacing token (16px, 24px), design-lint passes it in value-equivalence mode. If not, use a `var(--foundations-spacing-*)` reference.

**`design-system/no-hardcoded-spacing`:** A numeric literal was used in a JSX `style` object. Move spacing to CSS.

---

## Step 4: Add component-specific tokens (if needed)

If your component needs a token that doesn't exist yet (e.g. a specific background color for a card surface), add it to `tokens/components/card.json`:

```json
{
  "$schema": "https://dtif.lapidist.net/schema/core.json",
  "$version": "1.0.0",
  "$description": "Card component tokens.",
  "cmp": {
    "card": {
      "bg": {
        "$type": "color",
        "$description": "Card surface background.",
        "$value": { "colorSpace": "srgb", "components": [0.98, 0.98, 0.98] },
        "$extensions": {
          "lapidist.governance": {
            "owner": "Design Systems Guild",
            "reviewCadence": "monthly",
            "sla": "3 business days"
          }
        }
      }
    }
  }
}
```

Then add the same token to `tokens/catalog.tokens.json` under `cmp.card`. Restart the kernel:
```bash
pnpm run kernel:stop && pnpm run kernel:start
```

See [docs/how-to-add-a-token.md](how-to-add-a-token.md) for the full procedure.

---

## Step 5: Integrate with App.jsx

Add the component to `src/App.jsx`:
```jsx
import { Button } from './components/Button.jsx';
import { Card } from './components/Card.jsx';

export function App() {
  return (
    <main>
      <Card title="Example">
        <Button variant="primary">Get started</Button>
      </Card>
    </main>
  );
}
```

Run `pnpm run verify` again to confirm the new JSX passes all component-usage rules.

---

## Step 6: Understand the stylesheet variants

The `Button` component has three stylesheet files demonstrating design-lint's multi-format support:
- `button.css` — canonical stylesheet; this is what the component imports
- `button.scss` — SCSS variant demonstrating SCSS linting
- `button.less` — Less variant demonstrating Less linting

For a new component, a single `card.css` is sufficient. The SCSS and Less files exist to demonstrate that design-lint lints all three formats — you don't need all three for every component.

---

## When to use `design-lint-disable`

If your component has a justified exception to a rule, suppress it with a comment explaining why:

```jsx
// design-lint-disable-next-line design-system/component-usage
// Card.jsx is the DS implementation of <article> — suppressing the substitution rule on itself
<article className="card">
```

See [docs/design-lint.md](design-lint.md#inline-lint-suppression) for when suppression is appropriate.

---

## Checklist before committing

- [ ] `pnpm run verify` exits 0
- [ ] No raw hex/rgb colors in CSS — use `var(--catalog-tokens-clr-*)`
- [ ] No inline `style` props with hardcoded values
- [ ] Any new tokens added to both `foundations.json` (or `components/`) and `catalog.tokens.json`
- [ ] Kernel restarted after any token changes
- [ ] `pnpm run dtif:build` run to regenerate `tokens.css` if new component tokens were added
