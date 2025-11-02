---
description: Explain the token architecture and usage patterns
---

Provide a detailed explanation of this repository's design token system:

1. Read and analyze the token structure:
   - `tokens/catalog.json` (aggregator)
   - `tokens/foundations.json` (core tokens)
   - `tokens/components/button.json` (component tokens)
   - `tokens/themes/light.json` and `tokens/themes/dark.json` (theme overrides)

2. Explain the token flow:
   - How tokens are authored in DTIF format
   - How catalog.json aggregates them
   - How the build generates CSS and JSON outputs
   - How UI components consume the tokens

3. Show concrete examples:
   - Pick 2-3 tokens and trace them from source to usage
   - Demonstrate how theme overrides work
   - Show the actual CSS custom property references in components

4. Reference the relevant documentation:
   - Build configuration in `build/dtif-build.config.mjs`
   - Design-lint configuration in `design-lint.config.cjs`
   - Artifact structure in `ops/artifacts/README.md`

Make the explanation accessible to someone new to the DTIFx toolkit.
