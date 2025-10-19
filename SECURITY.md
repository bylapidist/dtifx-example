# Security Policy

## Supported versions

- The `main` branch receives security updates; consumers should track the repository head for the latest DTIF audit configuration.

## Reporting a vulnerability

- Email security@lapidist.net with a detailed description, reproduction steps, and affected DTIF artefacts.
- Include references to impacted token files under `tokens/` and any generated reports in `ops/artifacts/` to accelerate triage.
- Avoid opening public issues for security-sensitive disclosures.

## Hardening checklist

- Run `npm audit` during release preparation and document the outcome in the pull request description.
- Keep `audit/dtif-audit.config.mjs` aligned with the guidance at https://dtifx.lapidist.net/docs/audit/overview.
- Re-run `npm run dtif:audit` after dependency or token updates to ensure governance coverage remains intact.
