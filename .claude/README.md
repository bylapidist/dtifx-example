# Claude Configuration for DTIFx Example

This directory contains configuration and knowledge files that guide Claude Code agents when working with this repository.

## Files Overview

### `instructions.md`

Custom instructions that Claude agents should follow when working on this project. These instructions mirror and extend the guidelines in `AGENTS.md` (used by Codex) but are tailored for Claude's workflow patterns.

**Key areas covered:**
- Project overview and core principles
- Critical workflows for token and UI changes
- Tool-specific guidance (DTIFx CLI, design-lint)
- Error handling strategies
- Quality gates and pre-commit checklist

Claude agents will automatically reference these instructions to ensure work aligns with repository conventions.

### `project-knowledge.md`

Comprehensive project knowledge document that explains:
- What DTIFx is and how it works
- Repository architecture and file organization
- Design token philosophy and patterns
- Common workflows and their purposes
- Troubleshooting guidance
- CI/CD pipeline details

This file helps Claude agents understand the broader context and make informed decisions.

### `commands/` Directory

Slash commands for common workflows that can be invoked in Claude Code:

- **`/verify`**: Run ESLint and design-lint verification
- **`/build-tokens`**: Build and regenerate design token artifacts
- **`/check-tokens`**: Validate tokens and run governance audit
- **`/full-check`**: Run complete quality pipeline (mirrors CI)
- **`/explain-tokens`**: Get a detailed explanation of the token architecture

These commands provide guided execution of common tasks with appropriate context and reporting.

## Usage for Claude Agents

When working on this repository, Claude agents should:

1. **Start by reading `instructions.md`** to understand the core principles and workflows
2. **Reference `project-knowledge.md`** for deeper context about specific areas
3. **Use slash commands** to execute common workflows with proper validation and reporting
4. **Follow the quality gates** outlined in instructions before committing
5. **Maintain the artifact-first workflow** by regenerating outputs when sources change

## Usage for Developers

When using Claude Code in this repository:

- Type `/verify` to check linting before committing
- Type `/build-tokens` after editing token files
- Type `/check-tokens` to run full validation and audit
- Type `/full-check` before opening a pull request
- Type `/explain-tokens` to understand the token system

Claude will follow the instructions automatically, but you can also reference these files to understand how Claude approaches tasks in this repository.

## Relationship to AGENTS.md

The `AGENTS.md` file at the repository root contains guidelines for Codex agents. The files in this `.claude/` directory serve an equivalent purpose for Claude agents:

| AGENTS.md Guideline | Claude Equivalent | Location |
| --- | --- | --- |
| Use DTIFx CLI as-is | Core Principles #1 | instructions.md |
| Keep Node.js version aligned | Core Principles #2 | instructions.md |
| Markdown style conventions | Core Principles #5 | instructions.md |
| Update docs when commands change | Core Principles #4 | instructions.md |
| Regenerate artifacts | Core Principles #3 | instructions.md |

Both sets of guidelines ensure AI agents maintain consistency and follow repository best practices, regardless of which AI coding assistant is being used.

## Maintenance

When repository workflows change:

1. Update `instructions.md` with new guidelines or commands
2. Update `project-knowledge.md` with new architectural details
3. Add/modify slash commands in `commands/` as needed
4. Update this README if the configuration structure changes
5. Ensure `AGENTS.md` stays synchronized with equivalent Claude guidelines

This ensures both human contributors and AI agents have consistent, up-to-date guidance.
