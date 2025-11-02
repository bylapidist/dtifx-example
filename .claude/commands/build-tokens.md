---
description: Build and regenerate design token artifacts
---

Execute the token build workflow:

1. Run `npm run dtif:validate` to ensure DTIF sources compile
2. Run `npm run dtif:build` to regenerate token outputs (CSS and JSON)
3. Show what changed in the generated artifacts:
   - Read and summarize changes to `ops/artifacts/build/tokens.css`
   - Read and summarize changes to `ops/artifacts/build/tokens.json`
4. Report any validation errors or warnings

Provide a clear summary of:
- Whether validation passed
- What token files were regenerated
- High-level overview of what changed (new tokens, modified values, removals)
- Whether artifacts should be committed
