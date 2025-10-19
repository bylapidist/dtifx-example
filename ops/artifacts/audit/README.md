# Audit Reports

- `npm run dtif:audit` runs `dtifx audit run --reporter json --reporter markdown --config audit/dtif-audit.config.mjs --out-dir ops/artifacts/audit`, writing `report.json` and `report.md` here.
- Regenerate and commit both files alongside token updates so reviewers can confirm the current governance status.
