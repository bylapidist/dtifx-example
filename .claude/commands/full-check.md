---
description: Run complete quality pipeline (verify, validate, build, diff, audit)
---

Execute the full quality assurance pipeline that mirrors CI:

1. Run `npm run verify` (ESLint + design-lint)
2. Run `npm run dtif:validate` (DTIF compilation check)
3. Run `npm run dtif:build` (regenerate token outputs)
4. Run `npm run dtif:diff` (compare against baseline)
5. Run `npm run dtif:audit` (governance policy check)

For each step:
- Report pass/fail status
- Highlight any errors or warnings
- Summarize key findings

Provide a final summary:
- Overall status (ready to commit / needs fixes)
- List of artifacts that changed
- Any action items before pushing
- Pre-commit checklist status
