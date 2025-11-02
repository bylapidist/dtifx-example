# DTIFx Example Repository - Project Knowledge

## What is DTIFx?

DTIFx (Design Token Interchange Format Toolkit) is a CLI toolkit for managing design tokens in a standardized DTIF format. It enables teams to:

- Author design tokens as structured JSON documents
- Validate token schemas and relationships
- Generate platform-specific outputs (CSS, JSON, etc.)
- Compare token changes over time (diff)
- Enforce governance policies (audit)

This repository serves as a canonical example of DTIFx in production use.

## Repository Architecture

### Token Source Files (`tokens/`)

Design tokens are the single source of truth, authored in DTIF format:

- **`catalog.json`**: Aggregates all token sources using the `lapidist.catalog` extension. This is the entry point for the build system.
- **`foundations.json`**: Core design primitives (colors, spacing, typography, etc.) that form the foundation layer.
- **`components/button.json`**: Component-specific tokens that reference foundation tokens.
- **`themes/light.json`**: Theme-specific overrides for light mode using `$overrides` entries.
- **`themes/dark.json`**: Theme-specific overrides for dark mode using `$overrides` entries.

### Configuration Files

- **`build/dtif-build.config.mjs`**: Configuration for the build command (validation and generation).
- **`audit/dtif-audit.config.mjs`**: Governance policy definitions for the audit command.
- **`design-lint.config.cjs`**: Configuration for design-lint, imports `tokens/catalog.json` directly.
- **`eslint.config.js`**: ESLint configuration for JavaScript/JSX linting.

### Build Artifacts (`ops/artifacts/`)

Generated outputs committed for review (artifact-first workflow):

- **`build/tokens.css`**: Generated CSS custom properties from DTIF sources.
- **`build/tokens.json`**: Generated JSON token bundle for programmatic access.
- **`diff/baseline.dtif.json`**: Snapshot of approved token state for comparison.
- **`diff/report.json`**: Structured diff output showing breaking/additive changes.
- **`diff/report.md`**: Human-readable diff report (note: repo uses console reporter now).
- **`audit/report.json`**: Structured audit findings.
- **`audit/report.md`**: Human-readable governance audit report.
- **`validate/`**: Directory for captured validation output when needed.

Each subdirectory has its own README explaining the evidence and workflow.

### Sample UI (`src/`)

Demonstrates token consumption patterns:

- **`components/Button.jsx`**: React component that uses the button tokens.
- **`components/button.css`**: Stylesheet that imports generated tokens and references them via CSS custom properties.

Pattern: `@import '../../ops/artifacts/build/tokens.css'` followed by `var(--catalog-cmp-btn-bg)` references.

## Key Workflows

### 1. Token Development Cycle

```
Edit tokens/*.json → Validate → Build → Diff → Audit → Review → Commit
```

1. **Validate**: `npm run dtif:validate` checks DTIF compilation
2. **Build**: `npm run dtif:build` regenerates CSS/JSON outputs
3. **Diff**: `npm run dtif:diff` compares against baseline, generates JSON evidence
4. **Audit**: `npm run dtif:audit` checks governance policies
5. **Review**: Inspect `ops/artifacts/` for changes
6. **Commit**: Commit sources and artifacts together

### 2. UI Component Development

```
Edit src/ → Lint (design-lint) → Verify → Commit
```

1. **Edit**: Modify React component or CSS
2. **Lint**: `npm run design-lint` checks token usage compliance
3. **Verify**: `npm run verify` runs ESLint + design-lint
4. **Commit**: Push changes if verification passes

### 3. Documentation Updates

When commands, workflows, or artifact structure changes:

1. Update `README.md` with new command examples
2. Update `CONTRIBUTING.md` with workflow changes
3. Update `ops/artifacts/README.md` if artifact structure changes
4. Update individual artifact READMEs as needed

## Design Token Philosophy

### Layered Token Architecture

1. **Foundations**: Abstract, context-free design primitives
   - Example: `foundations.spacing.md`, `foundations.color.primary.500`

2. **Components**: Semantic tokens that reference foundations
   - Example: `catalog.cmp.btn.bg` → references → `foundations.color.primary.500`

3. **Themes**: Context-specific overrides
   - Example: Dark theme overrides `catalog.cmp.btn.bg` to use a different foundation color

### Token Consumption Pattern

```css
/* Import generated tokens */
@import '../../ops/artifacts/build/tokens.css';

/* Reference via CSS custom properties */
.button-primary {
  background-color: var(--catalog-cmp-btn-bg);
  padding-block: var(--catalog-cmp-btn-pad);
}
```

This pattern:
- Keeps token references explicit and traceable
- Allows design-lint to validate usage
- Enables theme switching via CSS custom properties
- Avoids hardcoded values

## Artifact-First Workflow

Unlike many repositories that `.gitignore` build outputs, this repo **commits artifacts** for several reasons:

1. **Reviewability**: Reviewers can diff generated CSS/JSON alongside source changes
2. **Evidence**: Audit and diff reports provide historical governance records
3. **Traceability**: Changes to token sources and their outputs are tracked together
4. **CI Transparency**: Generated artifacts must match what CI produces

This means:
- Always regenerate artifacts when token sources change
- Always commit both sources and artifacts in the same PR
- Always review artifact changes before merging

## Tool-Specific Notes

### DTIFx CLI

- **Commands**: `validate`, `build generate`, `diff compare`, `audit run`
- **Input**: Reads from `tokens/catalog.json` (which aggregates other files)
- **Output**: Writes to `ops/artifacts/` as configured
- **Configuration**: Build config in `build/`, audit config in `audit/`

Key insight: The CLI is the source of truth for token processing. Never create wrapper scripts or manually edit outputs.

### design-lint

- **Purpose**: Validates that CSS and React code uses approved tokens
- **Configuration**: `design-lint.config.cjs` imports the catalog
- **Scope**: Lints `src/**/*.{css,js,jsx,ts,tsx}`
- **Integration**: Part of `npm run verify` workflow

Key insight: design-lint enforces token discipline by catching hardcoded values that should be tokens.

## Common Issues and Solutions

### Issue: Validation fails after editing tokens

**Solution**: Check the error message for syntax errors or schema violations in the specific DTIF file. Consult DTIFx docs for schema requirements.

### Issue: design-lint reports violations

**Solution**: Check which CSS custom property should be used instead of the hardcoded value. Look in `ops/artifacts/build/tokens.css` for available tokens.

### Issue: Diff shows unexpected changes

**Solution**: Review both console diff output and `ops/artifacts/diff/report.json`. Check if metadata changed (file URIs) vs. actual token values. Update baseline only after approval.

### Issue: Audit reports policy violations

**Solution**: Review `ops/artifacts/audit/report.md`. Either fix the token to comply with policy, or update the policy in `audit/dtif-audit.config.mjs` if the violation is intentional.

### Issue: CI fails but local checks pass

**Solution**: Ensure you've committed regenerated artifacts. CI runs the same commands and compares outputs. If outputs differ, artifacts are stale.

## Version Requirements

- **Node.js**: 22.21.0 (see `.nvmrc`)
- **npm**: 10 or later
- **DTIFx CLI**: Installed locally via `npm install`
- **design-lint**: Installed locally via `npm install`

Never use global installations; always use local CLI via npm scripts.

## Documentation References

- **DTIFx Toolkit**: https://dtifx.lapidist.net/
- **design-lint**: https://design-lint.lapidist.net/
- **DTIF Specification**: https://github.com/bylapidist/dtif
- **Build Pipeline Guide**: https://github.com/bylapidist/dtifx/blob/main/docs/guides/build-pipeline.md
- **Theming and Overrides Spec**: https://github.com/bylapidist/dtif/blob/main/docs/spec/theming-overrides.md

## CI/CD Pipeline

**GitHub Actions Workflow**: `.github/workflows/ci.yml`

Runs on every push and pull request:
1. `npm ci` (clean install with lockfile)
2. `npm run verify` (ESLint + design-lint)
3. `npm run dtif:validate` (DTIF compilation)
4. `npm run dtif:build` (regenerate outputs)
5. `npm run dtif:diff` (compare against baseline, streams console reporter)
6. `npm run dtif:audit` (governance checks)

All steps must pass for CI to succeed. The diff command uses the console reporter instead of Markdown output.

## Contributing Checklist

Before opening a PR:

- [ ] `npm run verify` passes locally
- [ ] If tokens changed: regenerated artifacts committed
- [ ] If tokens changed: diff reviewed (breaking changes acceptable?)
- [ ] If tokens changed: audit passes or violations explained
- [ ] Documentation updated for any workflow changes
- [ ] Markdown files follow single-line bullets with two-space indents
- [ ] All files end with trailing newline

## Repository Ownership

This is a **canonical example** repository maintained by the DTIFx team. Changes should:

- Align with DTIFx best practices
- Serve as a reference implementation
- Include clear documentation
- Follow established conventions

When in doubt, consult the DTIFx team or reference the official documentation.
