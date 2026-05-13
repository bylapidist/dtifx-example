# Contributing

---

## What kind of change are you making?

| Change | Required steps before PR |
|---|---|
| **Token only** (add/modify/deprecate a token) | verify + dtif:validate + dtif:build + dtif:diff + dtif:audit + dtif:dscp |
| **Component only** (edit `src/`) | verify |
| **Both** | All of the above |
| **Documentation only** (edit `*.md` files) | verify (lint still runs on JS/CSS) |

---

## Before opening a pull request

### 1. Check prerequisites
```bash
node --version   # must be ≥24.0.0 (see .nvmrc)
pnpm --version   # must be ≥10.0.0
```

### 2. Install and start the kernel
```bash
pnpm install
pnpm run kernel:start  # required before any design-lint command
```

### 3. Run the relevant pipeline steps

**Every PR:**
```bash
pnpm run verify   # ESLint + design-lint — must exit 0 with 0 errors
```

**PRs that change tokens:**
```bash
pnpm run dtif:validate  # schema check
pnpm run dtif:build     # regenerate tokens.css and tokens.json
pnpm run dtif:diff      # compare against baseline
pnpm run dtif:audit     # governance check
pnpm run dtif:dscp      # regenerate DESIGN_SYSTEM.md
```

### 4. Review and commit artifacts

Artifacts in `ops/artifacts/` must be committed in the same PR as the source changes that generated them. Reviewers use these to verify the output without running the tools locally.

When tokens change, your PR description should include a brief summary of what `dtif:diff` reported (additive changes, breaking changes, or no change).

---

## PR scope

Keep PRs tightly scoped. A PR that adds a new token group, refactors three components, and updates CI all at once is hard to review. Prefer:
- One PR per token addition/change
- One PR per component addition/refactor
- Separate PRs for CI and tooling changes

---

## Review expectations

- **Token PRs** must be reviewed by a member of the Design Foundations Guild or Design Systems Guild (depending on the token tier).
- **Component PRs** can be reviewed by any repository maintainer.
- **Tooling PRs** should be reviewed by a platform engineer.
- Response SLA: **5 business days** for foundation tokens, **3 business days** for component tokens and code changes.

---

## Merge strategy

All PRs are **squash-merged** to keep the main branch history linear. Write your PR title as a conventional commit subject line:
```
feat(tokens): add letterSpacings.wide token
fix(button): correct focus ring shadow value
docs: rewrite architecture guide
```

---

## Development environment

- Use Node.js 24 (`nvm use` if you have nvm) and pnpm ≥10
- The DTIFx CLI and design-lint are installed locally via `pnpm install` — use `pnpm run` scripts, not global commands
- After changing token files, restart the kernel: `pnpm run kernel:stop && pnpm run kernel:start`
- Reference [docs/troubleshooting.md](docs/troubleshooting.md) for common errors

---

## Documentation style

- Spell "artefact" (UK English) consistently — not "artifact"
- Use `pnpm run` in commands — not `npm run`
- Link to `docs/glossary.md` on first use of any acronym (DTIF, DSR kernel, DSQL, SARIF, DSCP)
- Keep Markdown bullet items on a single line; indent sub-bullets with two spaces
- Update the relevant doc file whenever you change a workflow, script name, or artifact location

---

## Pull request checklist

- [ ] `pnpm run verify` exits 0 with 0 errors
- [ ] For token changes: `dtif:validate`, `dtif:build`, `dtif:diff`, `dtif:audit`, `dtif:dscp` run and artifacts committed
- [ ] Kernel restarted after any token file change
- [ ] PR title follows conventional commit format
- [ ] Documentation updated to reflect any workflow changes
- [ ] No `npm run` in any documentation (use `pnpm run`)
- [ ] No "artifact" spelling (use "artefact")

---

## AI agents

`AGENTS.md` contains guidance for AI coding agents (Claude, etc.) working in this repository. Human contributors should follow this `CONTRIBUTING.md` instead.
