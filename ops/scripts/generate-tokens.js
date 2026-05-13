/**
 * Token generation script — demonstrates the design-lint v8 programmatic
 * token API for producing CSS variables, JS constants, and TypeScript
 * declarations from a DTIF catalog file.
 *
 * Stable exports used:
 *   parseDtifTokensFile   — parse a .tokens.json file from disk with diagnostics
 *   flattenDesignTokens   — return canonical flattened DTIF entries from parse result
 *   generateCssVariables  — emit :root { --var: value } declarations
 *   generateJsConstants   — emit export const TOKEN_NAME = 'value'
 *   generateTsDeclarations — emit TypeScript const declarations with types
 *
 * Usage: node ops/scripts/generate-tokens.js
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseDtifTokensFile,
  flattenDesignTokens,
  generateCssVariables,
  generateJsConstants,
  generateTsDeclarations,
} from '@lapidist/design-lint';

const OUT_DIR = 'ops/artifacts/generated';
const CATALOG = 'tokens/catalog.tokens.json';

async function main() {
  console.log(`Parsing ${CATALOG}…`);

  // 1. Parse the DTIF catalog from disk.
  //    parseDtifTokensFile requires a .tokens.json (or .tokens.yaml) extension.
  //    Returns: { tokens, diagnostics, document, graph, resolver, … }
  const { tokens, diagnostics } = await parseDtifTokensFile(CATALOG);

  const warnings = diagnostics?.filter((d) => d.severity === 'warning') ?? [];
  if (warnings.length) {
    console.warn(`  ${warnings.length} parser diagnostic(s) (see DTIF5044 for unrecognised types)`);
  }

  // 2. Flatten the parsed tokens into canonical DTIF entries.
  //    flattenDesignTokens takes the `tokens` field from the parse result —
  //    not the raw result object or the `document` field.
  const flattened = flattenDesignTokens(tokens);
  console.log(`  ${flattened.length} tokens flattened`);

  // The generators expect tokens grouped by theme:
  //   { default: FlattenedToken[], dark: FlattenedToken[], … }
  // The default theme emits :root { … }, named themes emit [data-theme='name'] { … }
  const tokensByTheme = { default: flattened };

  mkdirSync(OUT_DIR, { recursive: true });

  // 3. CSS custom properties — :root { --token-name: value; }
  const css = generateCssVariables(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.css'), css);
  console.log(`  → ${OUT_DIR}/tokens.css`);

  // 4. JavaScript ES module constants — export const TOKEN_NAME = 'value';
  const js = generateJsConstants(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.js'), js);
  console.log(`  → ${OUT_DIR}/tokens.js`);

  // 5. TypeScript declarations — const TOKEN_NAME: string = 'value';
  const ts = generateTsDeclarations(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.d.ts'), ts);
  console.log(`  → ${OUT_DIR}/tokens.d.ts`);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
