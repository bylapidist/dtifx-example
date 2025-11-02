# Claude Agent Instructions for DTIFx Example

## Project Overview

This repository demonstrates a production-ready DTIFx (Design Token Interchange Format) toolkit setup with design-lint validation. The project maintains design tokens as source-of-truth and generates CSS/JSON outputs for consumption by UI components.

## Core Principles

1. **Use Official Tooling**: Always use the DTIFx CLI and design-lint as configured. Never create custom wrappers or reimplementations of toolkit behavior. The official commands are exposed via npm scripts in `package.json`.

2. **Version Alignment**: Keep Node.js version requirements synchronized across:
   - `.nvmrc` (currently 22.21.0)
   - `package.json` engines field
   - Documentation references (README.md, CONTRIBUTING.md)
   - CI workflow files (.github/workflows/ci.yml)

3. **Artifact-First Workflow**: This project commits generated artifacts under `ops/artifacts/` for review. When modifying DTIF sources:
   - Regenerate artifacts with `npm run dtif:build`
   - Run diff comparison with `npm run dtif:diff`
   - Execute audit checks with `npm run dtif:audit`
   - Commit the updated artifacts alongside source changes

4. **Documentation Maintenance**: Update contributor-facing documentation (`README.md`, `CONTRIBUTING.md`, `ops/artifacts/README.md`) whenever:
   - Commands or npm scripts change
   - Quality gates are added/modified
   - Artifact locations are reorganized
   - New workflows are introduced

5. **Markdown Style Conventions**:
   - Keep bullet items on a single line
   - Use two-space indentation for sub-bullets
   - End all files with a trailing newline
   - Maintain consistent heading hierarchy

## Critical Workflows

### Before Making Changes

1. **Read the documentation**: Start with `README.md` and `CONTRIBUTING.md` to understand the current setup
2. **Check artifact READMEs**: Each subdirectory in `ops/artifacts/` has its own README explaining the evidence
3. **Run verification**: Execute `npm run verify` to ensure the baseline is clean

### Token Modifications

When modifying design tokens in `tokens/`:

1. **Validate**: Run `npm run dtif:validate` to check DTIF compilation
2. **Generate**: Run `npm run dtif:build` to update `ops/artifacts/build/tokens.{css,json}`
3. **Compare**: Run `npm run dtif:diff` to see changes against the baseline
4. **Audit**: Run `npm run dtif:audit` to check governance policies
5. **Review**: Inspect all generated artifacts in `ops/artifacts/` before committing
6. **Update baseline**: If changes are approved, update `ops/artifacts/diff/baseline.dtif.json`

### UI Component Changes

When modifying components in `src/`:

1. **Lint**: Run `npm run design-lint` to verify token usage compliance
2. **ESLint**: Run `npm run verify` to check both ESLint and design-lint
3. **Review violations**: Fix any token misuse flagged by design-lint
4. **Document patterns**: Update README if introducing new token usage patterns

### Documentation Updates

1. **Maintain command accuracy**: Ensure all command examples in docs match actual npm scripts
2. **Update references**: Keep links to DTIFx and design-lint documentation current
3. **Preserve formatting**: Follow existing Markdown conventions (see principle #5)
4. **Cross-reference**: Update all affected docs when changing workflows

## Common Commands

```bash
# Install dependencies
npm install

# Run all linters (ESLint + design-lint)
npm run verify

# Validate DTIF sources compile
npm run dtif:validate

# Generate token outputs (CSS + JSON)
npm run dtif:build

# Compare against baseline and generate evidence
npm run dtif:diff

# Run governance audit
npm run dtif:audit

# Lint UI components for token compliance
npm run design-lint
```

## Tool-Specific Guidance

### DTIFx CLI

- Configuration files live in `build/` and `audit/` directories
- Never modify the CLI's behavior through environment variables or flags not documented in configs
- Generated outputs go to `ops/artifacts/build/` as defined in `build/dtif-build.config.mjs`
- Validation uses the same config: `build/dtif-build.config.mjs`

### design-lint

- Configuration: `design-lint.config.cjs` at repository root
- Imports the token catalog directly: `tokens/catalog.json`
- Lints CSS and JSX files in `src/` for token usage violations
- Exit code zero means compliance; non-zero indicates violations

### Git Workflow

- Create feature branches with descriptive names
- Commit artifacts with source changes in the same PR
- Pull request descriptions should reference which artifacts changed
- CI runs full verification pipeline (`.github/workflows/ci.yml`)

## Token Architecture

### Bundle Topology

- `tokens/catalog.json`: Aggregates all token sources via `lapidist.catalog` extension
- `tokens/foundations.json`: Core tokens (spacing, colors, typography)
- `tokens/components/*.json`: Component-specific tokens (e.g., button.json)
- `tokens/themes/*.json`: Theme variations with `$overrides` (light.json, dark.json)

### Usage Pattern

1. Design tokens are authored in `tokens/` as DTIF JSON
2. `catalog.json` aggregates them into a coherent bundle
3. Build command generates `ops/artifacts/build/tokens.css` and `tokens.json`
4. UI components import CSS tokens: `@import '../../ops/artifacts/build/tokens.css'`
5. Components reference tokens via CSS custom properties: `var(--catalog-cmp-btn-bg)`

## Error Handling

### Validation Failures

If `npm run dtif:validate` fails:
1. Read the error message for which DTIF document has issues
2. Check syntax and schema compliance in that file
3. Consult DTIFx documentation: https://dtifx.lapidist.net/
4. Fix the source document, don't patch generated artifacts

### Design-lint Violations

If `npm run design-lint` reports violations:
1. Review the specific CSS/JSX file and line number
2. Check which token should be used instead of the hardcoded value
3. Consult `ops/artifacts/build/tokens.css` for available tokens
4. Update the component to use the correct CSS custom property

### Diff Changes

When `npm run dtif:diff` shows breaking changes:
1. Review both console output and `ops/artifacts/diff/report.json`
2. Assess impact on existing UI components
3. Decide whether to proceed with breaking change or adjust tokens
4. Update `baseline.dtif.json` only after approval

### Audit Failures

If `npm run dtif:audit` reports policy violations:
1. Read `ops/artifacts/audit/report.md` for human-readable findings
2. Check `ops/artifacts/audit/report.json` for structured data
3. Either fix the violation or update the policy in `audit/dtif-audit.config.mjs`
4. Document the decision in commit message

## Quality Gates

Before committing:
- [ ] `npm run verify` passes (ESLint + design-lint)
- [ ] `npm run dtif:validate` passes
- [ ] If tokens changed: `npm run dtif:build` and artifacts committed
- [ ] If tokens changed: `npm run dtif:diff` reviewed
- [ ] If tokens changed: `npm run dtif:audit` passes or violations explained
- [ ] Documentation updated to reflect any workflow changes
- [ ] All files end with trailing newline
- [ ] Markdown follows single-line bullet style with two-space indents

## Important Reminders

- **Never modify generated artifacts manually** - always regenerate via CLI
- **Commit artifacts with sources** - reviewers need to diff both together
- **Follow existing patterns** - this is a canonical example repository
- **Read ops/artifacts/README.md** - it explains the artifact structure in detail
- **Consult official docs first** - DTIFx and design-lint documentation is authoritative

## References

- DTIFx Toolkit: https://dtifx.lapidist.net/
- design-lint: https://design-lint.lapidist.net/
- DTIF Specification: https://github.com/bylapidist/dtif
- Repository Layout: See README.md
- Contribution Guidelines: See CONTRIBUTING.md
- Security Policy: See SECURITY.md
