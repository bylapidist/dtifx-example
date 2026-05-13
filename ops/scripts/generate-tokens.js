/**
 * Token generation script — demonstrates the design-lint v8 programmatic
 * token API for parsing, indexing, and generating output from DTIF catalogs.
 *
 * Stable exports demonstrated:
 *   parseDtifTokensFile   — parse a .tokens.json file from disk with diagnostics
 *   readDtifTokensFile    — read a .tokens.json file as a raw parsed JSON object
 *   flattenDesignTokens   — return canonical flattened DTIF entries from parse result
 *   indexDtifTokens       — build a pointer-keyed lookup map from flattened tokens
 *   createDtifNameIndex   — build a name-keyed lookup map from flattened tokens
 *   DtifTokenRegistry     — aggregate flattened tokens by theme with getByPointer/getByName/getTokens
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
  readDtifTokensFile,
  flattenDesignTokens,
  indexDtifTokens,
  createDtifNameIndex,
  DtifTokenRegistry,
  generateCssVariables,
  generateJsConstants,
  generateTsDeclarations,
} from '@lapidist/design-lint';

const OUT_DIR = 'ops/artifacts/generated';
const CATALOG = 'tokens/catalog.tokens.json';

async function main() {
  // 1. readDtifTokensFile — read the raw catalog as a parsed JSON object.
  //    Useful when you need the raw DTIF document structure (not flattened tokens).
  const rawDocument = await readDtifTokensFile(CATALOG);
  console.log(`readDtifTokensFile: ${Object.keys(rawDocument).filter(k => !k.startsWith('$')).length} top-level token groups`);

  // 2. parseDtifTokensFile — parse with full diagnostics and resolution metadata.
  //    Requires a .tokens.json (or .tokens.yaml) file extension.
  console.log(`\nParsing ${CATALOG}…`);
  const { tokens, diagnostics } = await parseDtifTokensFile(CATALOG);
  const warnings = diagnostics?.filter((d) => d.severity === 'warning') ?? [];
  if (warnings.length) {
    console.log(`  ${warnings.length} parser diagnostic(s) (DTIF5044 for unrecognised types)`);
  }

  // 3. flattenDesignTokens — convert the parse result into canonical DTIF entries.
  //    Takes the `tokens` field from the parse result (not the raw document).
  //    Each entry has: id, pointer, path, name, type, value, raw, metadata, resolution.
  const flattened = flattenDesignTokens(tokens);
  console.log(`  ${flattened.length} tokens flattened`);

  // 4. indexDtifTokens — build a pointer → FlattenedToken lookup map.
  //    Fast O(1) lookup by DTIF pointer (e.g. '#/clr/brand').
  // Both index functions return Map<string, FlattenedToken> — use .get() and .size
  const byPointer = indexDtifTokens(flattened);
  const brandToken = byPointer.get('#/clr/brand');
  console.log(`\nindexDtifTokens: ${byPointer.size} entries`);
  if (brandToken) console.log(`  #/clr/brand → type: ${brandToken.type}`);

  // 5. createDtifNameIndex — build a name → FlattenedToken lookup map (also a Map).
  //    Fast O(1) lookup by token name (derived from the last path segment).
  const byName = createDtifNameIndex(flattened);
  console.log(`createDtifNameIndex: ${byName.size} entries`);

  // 6. DtifTokenRegistry — aggregate flattened tokens by theme.
  //    Provides getByPointer(), getByName(), and getTokens() methods.
  //    The default theme uses 'default'; named themes use their theme key.
  const registry = new DtifTokenRegistry({ default: flattened });
  const regBrand = registry.getByPointer('#/clr/brand');
  const regSpacing = registry.getByName('md');
  const allInRegistry = registry.getTokens('default');
  console.log(`DtifTokenRegistry:`);
  console.log(`  getByPointer('#/clr/brand') → ${regBrand ? regBrand.type : 'not found'}`);
  console.log(`  getByName('md') → ${regSpacing ? regSpacing.type : 'not found'}`);
  console.log(`  getTokens('default') → ${allInRegistry.length} tokens`);

  // 7. Generate outputs — all generators take { [theme]: FlattenedToken[] }
  const tokensByTheme = { default: flattened };
  mkdirSync(OUT_DIR, { recursive: true });

  // CSS custom properties — :root { --token-name: value; }
  const css = generateCssVariables(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.css'), css);
  console.log(`\n  → ${OUT_DIR}/tokens.css`);

  // JavaScript ES module constants — export const TOKEN_NAME = 'value';
  const js = generateJsConstants(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.js'), js);
  console.log(`  → ${OUT_DIR}/tokens.js`);

  // TypeScript declarations — export const tokens = { default: { … } }
  const ts = generateTsDeclarations(tokensByTheme);
  writeFileSync(join(OUT_DIR, 'tokens.d.ts'), ts);
  console.log(`  → ${OUT_DIR}/tokens.d.ts`);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
