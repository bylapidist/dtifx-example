# DTIFx Diff report

## Executive summary
- Recommended version bump: **Major**
- Compared: ops/artifacts/diff/baseline.dtif.json → tokens/catalog.json
- Started: 2025-10-23 19:23 UTC
- Duration: 650ms
- Impact: 4 breaking · 12 non-breaking
- Changes: 4 added · 8 changed · 4 removed · 0 renamed
- Tokens analysed: 12 previous → 12 next
- Change mix: 0 value changes, 8 metadata changes
- Type hotspots: dimension (8 changes, 3 breaking), duration (2 changes, 1 breaking), color (5 changes, 5 non-breaking), fontweight (1 change, 1 non-breaking)
- Group hotspots: space (2 changes, 2 breaking), motion (1 change, 1 breaking), motionvar (1 change, 1 breaking), cmp (4 changes, 4 non-breaking)

### Type breakdown
| Type | Previous | Next | Added | Removed | Renamed | Changed | Value changes | Metadata changes | Unchanged | Breaking | Non-breaking |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| color | 5 | 5 | 0 | 0 | 0 | 5 | 0 | 5 | 0 | 0 | 5 |
| dimension | 5 | 5 | 3 | 3 | 0 | 2 | 0 | 2 | 0 | 3 | 5 |
| duration | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| fontweight | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |

### Group breakdown
| Group | Previous | Next | Added | Removed | Renamed | Changed | Value changes | Metadata changes | Unchanged | Breaking | Non-breaking |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| clr | 2 | 2 | 0 | 0 | 0 | 2 | 0 | 2 | 0 | 0 | 2 |
| cmp | 4 | 4 | 0 | 0 | 0 | 4 | 0 | 4 | 0 | 0 | 4 |
| cmp/btn | 4 | 4 | 0 | 0 | 0 | 4 | 0 | 4 | 0 | 0 | 4 |
| durations | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| durationvars | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| motion | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| motionvar | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| space | 2 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| spacing | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| weight | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| weightvar | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |

## Grouped detail

### color (5 changes: 5 changed)

#### clr (2 changes: 2 changed)
##### Changed (2)
- ~ `#/clr/brand` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#0E5CAD;" aria-label="#0E5CAD" title="#0E5CAD"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/clr/brand in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/brand/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/brand/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/brand' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/brand' }]
- ~ `#/clr/bg` — Metadata updated <span style="display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;border:1px solid #d0d7de;vertical-align:middle;margin-left:0.5rem;background:#FFFFFF;" aria-label="#FFFFFF" title="#FFFFFF"></span> (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/clr/bg in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/bg/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/bg/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/clr/bg' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/clr/bg' }]

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

### dimension (8 changes: 2 changed · 3 removed · 3 added)

#### cmp/btn (1 change: 1 changed)
##### Changed (1)
- ~ `#/cmp/btn/pad` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/cmp/btn/pad in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/pad/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/pad/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/cmp/btn/pad' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/cmp/btn/pad' }]

#### durationVars (1 change: 1 added)
##### Added (1)
- + `#/durationVars/btn` = { dimensionType: 'custom', unit: 'duration.ms', value: 120 } (_non-breaking_)
  - Impact: Non-breaking addition: publicise availability to adopters.
  - Next: Plan adoption for #/durationVars/btn across consuming teams.

#### motionVar (1 change: 1 removed)
##### Removed (1)
- - `#/motionVar/btn` (was { dimensionType: 'custom', unit: 'duration.ms', value: 120 }) (**breaking**)
  - Impact: Breaking removal: existing references will fail.
  - Next: Audit consumers of #/motionVar/btn and migrate to replacements.

#### space (2 changes: 2 removed)
##### Removed (2)
- - `#/space/md` (was { dimensionType: 'length', unit: 'px', value: 16 }) (**breaking**)
  - Impact: Breaking removal: existing references will fail.
  - Next: Audit consumers of #/space/md and migrate to replacements.
- - `#/space/lg` (was { dimensionType: 'length', unit: 'px', value: 24 }) (**breaking**)
  - Impact: Breaking removal: existing references will fail.
  - Next: Audit consumers of #/space/lg and migrate to replacements.

#### spacing (2 changes: 2 added)
##### Added (2)
- + `#/spacing/md` = { dimensionType: 'length', unit: 'px', value: 16 } (_non-breaking_)
  - Impact: Non-breaking addition: publicise availability to adopters.
  - Next: Plan adoption for #/spacing/md across consuming teams.
- + `#/spacing/lg` = { dimensionType: 'length', unit: 'px', value: 24 } (_non-breaking_)
  - Impact: Non-breaking addition: publicise availability to adopters.
  - Next: Plan adoption for #/spacing/lg across consuming teams.

#### weightVar (1 change: 1 changed)
##### Changed (1)
- ~ `#/weightVar/semibold` — Metadata updated (_non-breaking_)
  - Impact: Non-breaking update: confirm expected outcomes and visuals.
  - Next: Spot-check #/weightVar/semibold in consuming products.
  - references: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weightVar/semibold/$value' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weightVar/semibold/$value' }]
  - resolutionPath: [{ uri: 'file:///workspace/dtifx-example/ops/artifacts/diff/baseline.dtif.json', pointer: '#/weightVar/semibold' }] → [{ uri: 'file:///workspace/dtifx-example/tokens/catalog.json', pointer: '#/weightVar/semibold' }]

### duration (2 changes: 1 removed · 1 added)

#### durations (1 change: 1 added)
##### Added (1)
- + `#/durations/btn` = { durationType: 'css.transition-duration', unit: 'ms', value: 120 } (_non-breaking_)
  - Impact: Non-breaking addition: publicise availability to adopters.
  - Next: Plan adoption for #/durations/btn across consuming teams.

#### motion (1 change: 1 removed)
##### Removed (1)
- - `#/motion/btn` (was { durationType: 'css.transition-duration', unit: 'ms', value: 120 }) (**breaking**)
  - Impact: Breaking removal: existing references will fail.
  - Next: Audit consumers of #/motion/btn and migrate to replacements.

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
