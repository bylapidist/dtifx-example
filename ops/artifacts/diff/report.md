# DTIFx Diff report

## Executive summary
- Recommended version bump: **Patch**
- Compared: ops/artifacts/diff/baseline.dtif.json → tokens/catalog.json
- Started: 2026-02-23 23:48 UTC
- Duration: 153ms
- Impact: 0 breaking · 12 non-breaking
- Changes: 0 added · 12 changed · 0 removed · 0 renamed
- Tokens analysed: 12 previous → 12 next
- Change mix: 0 value changes, 12 metadata changes
- Type hotspots: color (5 changes, 5 non-breaking), dimension (5 changes, 5 non-breaking), duration (1 change, 1 non-breaking), fontweight (1 change, 1 non-breaking)
- Group hotspots: cmp (4 changes, 4 non-breaking), cmp/btn (4 changes, 4 non-breaking), clr (2 changes, 2 non-breaking), spacing (2 changes, 2 non-breaking)

### Type breakdown
| Type | Previous | Next | Added | Removed | Renamed | Changed | Value changes | Metadata changes | Unchanged | Breaking | Non-breaking |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| color | 5 | 5 | 0 | 0 | 0 | 5 | 0 | 5 | 0 | 0 | 5 |
| dimension | 5 | 5 | 0 | 0 | 0 | 5 | 0 | 5 | 0 | 0 | 5 |
| duration | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| fontweight | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |

### Group breakdown
| Group | Previous | Next | Added | Removed | Renamed | Changed | Value changes | Metadata changes | Unchanged | Breaking | Non-breaking |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| clr | 2 | 2 | 0 | 0 | 0 | 2 | 0 | 2 | 0 | 0 | 2 |
| cmp | 4 | 4 | 0 | 0 | 0 | 4 | 0 | 4 | 0 | 0 | 4 |
| cmp/btn | 4 | 4 | 0 | 0 | 0 | 4 | 0 | 4 | 0 | 0 | 4 |
| durations | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| durationvars | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| spacing | 2 | 2 | 0 | 0 | 0 | 2 | 0 | 2 | 0 | 0 | 2 |
| weight | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| weightvar | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |

## Grouped detail

### color (5 changes: 5 changed)

#### clr (2 changes: 2 changed)
##### Changed (2)
- ~ `#/clr/bg` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#FFFFFF;" aria-label="#FFFFFF" title="#FFFFFF"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/clr/bg in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/bg/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/bg/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/bg' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/bg' }]
- ~ `#/clr/brand` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#0E5CAD;" aria-label="#0E5CAD" title="#0E5CAD"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/clr/brand in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/brand/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/brand/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/brand' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/brand' }]

#### cmp/btn (3 changes: 3 changed)
##### Changed (3)
- ~ `#/cmp/btn/bg` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#0E5CAD;" aria-label="#0E5CAD" title="#0E5CAD"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/cmp/btn/bg in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/bg/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/bg/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/bg' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/bg' }]
- ~ `#/cmp/btn/bg-hover` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#0C529A;" aria-label="#0C529A" title="#0C529A"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/cmp/btn/bg-hover in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/bg-hover/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/bg-hover/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/bg-hover' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/bg-hover' }]
- ~ `#/cmp/btn/fg` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#FFFFFF;" aria-label="#FFFFFF" title="#FFFFFF"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/cmp/btn/fg in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/fg/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/fg/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/fg' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/fg' }]

### dimension (5 changes: 5 changed)

#### cmp/btn (1 change: 1 changed)
##### Changed (1)
- ~ `#/cmp/btn/pad` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/cmp/btn/pad in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/pad/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/pad/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/pad' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/pad' }]

#### durationVars (1 change: 1 changed)
##### Changed (1)
- ~ `#/durationVars/btn` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/durationVars/btn in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/durationVars/btn/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/durationVars/btn/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/durationVars/btn' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/durationVars/btn' }]

#### spacing (2 changes: 2 changed)
##### Changed (2)
- ~ `#/spacing/lg` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/spacing/lg in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/spacing/lg/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/spacing/lg/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/spacing/lg' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/spacing/lg' }]
- ~ `#/spacing/md` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/spacing/md in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/spacing/md/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/spacing/md/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/spacing/md' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/spacing/md' }]

#### weightVar (1 change: 1 changed)
##### Changed (1)
- ~ `#/weightVar/semibold` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/weightVar/semibold in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weightVar/semibold/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weightVar/semibold/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weightVar/semibold' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weightVar/semibold' }]

### duration (1 change: 1 changed)

#### durations (1 change: 1 changed)
##### Changed (1)
- ~ `#/durations/btn` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/durations/btn in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/durations/btn/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/durations/btn/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/durations/btn' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/durations/btn' }]

### fontweight (1 change: 1 changed)

#### weight (1 change: 1 changed)
##### Changed (1)
- ~ `#/weight/semibold` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/weight/semibold in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weight/semibold/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weight/semibold/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weight/semibold' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weight/semibold' }]

## Hints
- Use `--verbose` or `--mode detailed` for full token metadata and links.
- Show rationale with `--why` and adjust context via `--diff-context N`.
- Disable OSC-8 links with `--no-links`.
- Export machine output via `--format json|yaml|sarif --output ./reports/dtifx-diff.json`.

## Exit codes
- 0 success
- 1 failure triggered by `--fail-on-breaking` or `--fail-on-changes`.
- 2 parser or IO error.
