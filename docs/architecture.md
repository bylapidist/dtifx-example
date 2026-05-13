# Architecture

Why the stack is built the way it is. Each section follows **Problem → Solution → Trade-off**.

---

## Why DTIF instead of Style Dictionary or raw CSS variables?

**Problem:** Style Dictionary is a transformation pipeline — it reads tokens and writes output files. It doesn't validate that components actually *use* those outputs. You can build `tokens.css` and then have developers ignore it entirely.

**Solution:** DTIF is both a schema and a runtime contract. The DSR kernel loads DTIF tokens and exposes them over DSQL. design-lint queries the kernel at lint time, so it can verify that every `var()` reference in your CSS corresponds to a real, approved token. The kernel is the bridge between authoring (DTIF files) and enforcement (lint rules).

**Trade-off:** The kernel daemon adds operational complexity — you must start it before linting. In exchange, you get live token validation that catches regressions at commit time rather than at design review.

---

## Why do `foundations.json` and `catalog.tokens.json` both exist?

**Problem:** The DSR kernel needs a single entry point to load all tokens at startup. But token sources are intentionally split across files (foundations, components, themes) for separation of concerns.

**Solution:** `catalog.tokens.json` is the aggregator. It inlines every token from every source and declares its sources in `$extensions.lapidist.catalog.sources`. The kernel reads this one file. `foundations.json`, `components/button.json`, and `themes/*.json` are the *authored* sources — they are what you edit.

**Trade-off:** You must keep `catalog.tokens.json` in sync with the individual source files manually. If you add a token to `foundations.json` and forget to mirror it in `catalog.tokens.json`, the kernel won't see it and design-lint rules will pass when they should fail. The sync requirement is the cost of having both human-editable sources and a single kernel entry point.

See [docs/token-system.md](token-system.md) for the full multi-file architecture.

---

## Why a long-lived kernel daemon instead of reading token files per lint invocation?

**Problem:** Reading and parsing DTIF token files on every lint run is slow, especially in watch mode or large repos. More importantly, token queries need to be fast enough to not block the linter mid-file.

**Solution:** The DSR kernel pre-loads the entire token graph at startup. Subsequent queries go over a Unix socket and are answered from memory. DSQL queries (e.g. "does `rgba(14,92,173,0.4)` match any registered shadow token?") execute in microseconds.

**Trade-off:** The kernel must be running before any lint command. In CI, this requires an explicit `kernel:start` step before `verify`. After any change to token files, the kernel must be restarted to pick up the changes — it does not watch files.

---

## Why commit generated artifacts to git?

**Problem:** `dtif:build` produces `tokens.css` and `tokens.json`. `dtif:diff` produces a comparison report. `dtif:audit` produces governance evidence. If these are `.gitignore`d, PR reviewers have no way to see what changed in the generated outputs — they can only see the source changes.

**Solution:** Artifacts are committed alongside source changes. A PR that adds `spacing.sm = 8px` to `foundations.json` also includes the diff in `tokens.css` showing `--foundations-spacing-sm: 8px` was added. Reviewers can verify the output matches expectations without running the build locally.

**Trade-off:** The repository contains both source and derived files. Stale artifacts (forgotten to regenerate after a token change) will cause CI failures during `dtif:diff`. This is intentional — the diff step acts as a consistency check.

---

## Why does the CSS var name include the source file stem?

**Problem:** The build processes multiple source files (`catalog.tokens.json`, `foundations.json`, `components/button.json`). Token `clr.brand` exists in both `catalog.tokens.json` and `foundations.json`. Without namespacing, the build would emit duplicate `--clr-brand` declarations and the last one would silently win.

**Solution:** The build configuration uses `pointerTemplate(placeholder('stem'))` which prefixes each token's CSS variable with its source file stem:

```
catalog.tokens.json  →  --catalog-tokens-clr-brand
foundations.json     →  --foundations-clr-brand
components/button.json → --button-cmp-btn-bg
```

**Trade-off:** CSS variable names are long and include the source file name. Use `--catalog-tokens-*` variables in component stylesheets — they aggregate all sources and are the most stable. The `--foundations-*` variables are also available and sometimes preferable for foundation-layer values (spacing, font sizes) when you want to be explicit about the tier.

This is also why the `design-token/css-var-provenance` rule is set to `warn` rather than `error`: the rule expects pointer-derived names like `--clr-brand`, but our variables have stem prefixes like `--catalog-tokens-clr-brand`. The rule is configured permissively to avoid false positives from this naming convention.

---

## Why is `design-token/css-var-provenance` set to `warn` not `error`?

See the trade-off in the section above. The short answer: our multi-stem CSS var naming is intentional and architectural. Making the provenance rule an error would require either renaming all CSS variables (breaking change to component stylesheets) or disabling the rule entirely. Keeping it at `warn` means the rule still surfaces genuinely unregistered variables while tolerating the stem-prefix pattern.

---

## How the token-to-CSS pipeline works end to end

```
tokens/foundations.json          ← human-edited DTIF source
tokens/components/button.json    ← human-edited DTIF source
tokens/themes/{dark,light}.json  ← human-edited theme overrides
         │
         │ kept in sync manually
         ▼
tokens/catalog.tokens.json       ← kernel entry point (inlines all sources)
         │
         ├──► DSR kernel (loaded at `kernel:start`)
         │         │
         │         └──► design-lint queries via DSQL at lint time
         │
         └──► dtif:build
                   │
                   ▼
         ops/artifacts/build/
           tokens.css   ← :root { --foundations-spacing-md: 16px; … }
           tokens.json  ← JSON snapshot for tooling
                   │
                   ▼
         src/components/button.css
           @import '../../ops/artifacts/build/tokens.css'
           .button-primary { background-color: var(--catalog-tokens-cmp-btn-bg); }
```
