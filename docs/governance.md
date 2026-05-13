# Token Governance

Every token in this design system carries governance metadata that declares ownership and sets expectations for how it will be maintained.

---

## What governance metadata is

Each token in `tokens/foundations.json` and `tokens/catalog.tokens.json` carries:

```json
"$extensions": {
  "lapidist.governance": {
    "owner": "Design Foundations Guild",
    "reviewCadence": "quarterly",
    "sla": "5 business days"
  }
}
```

| Field | Meaning |
|---|---|
| `owner` | The team or person responsible for this token's value. Questions and change requests go here. |
| `reviewCadence` | How often this token's value should be reviewed (e.g. `quarterly`, `monthly`). Not enforced automatically — it's a commitment. |
| `sla` | How long a requester can expect to wait for a response to a change request. |

The two owner strings used in this repo:
- **"Design Foundations Guild"** — owns primitive tokens (colors, spacing, typography, motion). These are the source of truth for the entire design language.
- **"Design Systems Guild"** — owns component-scoped tokens (button variants, etc.). These are owned by the team building the component library.

---

## Accessibility metadata

Some tokens also carry accessibility annotations:

```json
"lapidist.accessibility": {
  "contrastTarget": "AA",
  "usage": ["btn.primary.bg"]
}
```

| Field | Meaning |
|---|---|
| `contrastTarget` | The WCAG contrast level this token is designed to meet (`AA` or `AAA`). |
| `usage` | A list of usage contexts — where this token is expected to be used. |

These fields are informational; they are not automatically validated by the audit step. However, they appear in `DESIGN_SYSTEM.md` and in any DSCP-compatible tooling connected to the kernel.

---

## How the audit enforces governance

`pnpm run dtif:audit` runs governance policies defined in `audit/dtif-audit.config.mjs`:

```js
policies: [
  {
    name: 'governance.requireOwner',
    options: {
      extension: 'lapidist.governance',
      field: 'owner',
      severity: 'warning',
      message: 'Token is missing governance owner metadata.',
    },
  },
],
```

The audit currently requires every token to have an `owner` field. Missing it produces a warning in `ops/artifacts/audit/report.json` and `report.md`.

**When does CI fail?** The audit step itself exits successfully even with warnings (it's producing evidence, not enforcing a pass/fail gate by default). Check `ops/artifacts/audit/report.md` in each PR for any governance regressions.

---

## Adding governance metadata to a new token

Every new token must include the full governance block. Copy this template:

```json
"$extensions": {
  "lapidist.governance": {
    "owner": "Design Foundations Guild",
    "reviewCadence": "quarterly",
    "sla": "5 business days"
  }
}
```

Use `"Design Systems Guild"` and `"monthly"` / `"3 business days"` for component-scoped tokens.

---

## The deprecation lifecycle

When a token is superseded by a new one:

**Step 1: Mark the old token as deprecated**
```json
"pad": {
  "$type": "dimension",
  "$deprecated": { "$replacement": "#/cmp/btn/padding" },
  "$value": { "dimensionType": "length", "value": 16, "unit": "px" },
  …
}
```

**Step 2: Add the replacement token** alongside it (same value or updated value).

**Step 3: Let the linter catch usages** — `design-system/deprecation` is configured at `warn` severity. Any JS/TS file that references the deprecated token path by string literal will be flagged.

**Step 4: Update consumers** — fix the code that uses the deprecated token.

**Step 5: Remove the deprecated token** in a later PR once all usages are gone. Verify with `pnpm run design-lint` — if `design-system/no-unused-tokens` no longer warns about the old token, it's safe to remove.

---

## Governance across files

Governance metadata must appear in **both** `foundations.json` and `catalog.tokens.json` for the token it describes. When you add or change governance fields, mirror the change in both files. The `dtif:audit` reads the catalog — it's the source the audit tool sees.
