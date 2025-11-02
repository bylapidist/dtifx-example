---
description: Validate tokens and run governance audit
---

Run comprehensive token validation and policy checks:

1. Execute `npm run dtif:validate` to verify DTIF compilation
2. Execute `npm run dtif:diff` to compare against baseline
3. Execute `npm run dtif:audit` to check governance policies
4. Review the generated reports:
   - `ops/artifacts/diff/report.json` and console diff output
   - `ops/artifacts/audit/report.md`
   - `ops/artifacts/audit/report.json`

Provide a summary including:
- Validation status (pass/fail)
- Diff results (breaking changes, additions, removals)
- Audit findings (policy violations, warnings)
- Recommendations for next steps
- Whether baseline should be updated
