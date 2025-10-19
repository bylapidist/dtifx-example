# Diff Reports

- `baseline.dtif.json` stores the approved bundle snapshot used by `npm run dtif:diff`.
- `report.json` and `report.md` record the latest comparison between the baseline and `tokens/catalog.json`.
- After approving changes, replace the baseline with the new build output and regenerate the reports so history stays accurate.
