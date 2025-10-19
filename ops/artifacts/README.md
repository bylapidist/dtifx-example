# Artefact Storage

- `build/` – outputs from `npm run dtif:build` (registry JSON, manifest, CSS variables, telemetry).
- `diff/` – baseline registry (`baseline.json`) and latest diff reports (`report.json`, `report.md`) produced by `npm run dtif:diff`.
- `validate/` – validation logs emitted by `dtif validate` when requested.
- `audit/` – governance reports from `npm run dtif:audit`.
