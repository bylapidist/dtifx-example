/**
 * Generate ESM dist files for the design-lint preset packages.
 *
 * The preset packages (@lapidist/design-lint-config-recommended, -strict,
 * -ai-agent) ship TypeScript source but no compiled output. This script
 * strips the TypeScript-only syntax (type imports, satisfies expressions)
 * to produce valid ESM without requiring tsc or any build tooling.
 *
 * Runs automatically via the "prepare" lifecycle hook after pnpm install.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../../..');
const PRESETS = ['recommended', 'strict', 'ai-agent'];

for (const preset of PRESETS) {
  const pkgDir = join(root, `node_modules/@lapidist/design-lint-config-${preset}`);
  const srcFile = join(pkgDir, 'src/index.ts');

  if (!existsSync(srcFile)) {
    console.warn(`build-presets: ${preset} source not found, skipping`);
    continue;
  }

  const src = readFileSync(srcFile, 'utf8');

  // Strip TypeScript-only syntax to produce valid ESM:
  //   1. Remove "import type { ... }" lines (type-only imports)
  //   2. Remove ") satisfies Config" type assertion
  const js = src
    .replace(/^import type[^\n]*\n/gm, '')
    .replace(/\}\s+satisfies\s+\w+;/, '};');

  mkdirSync(join(pkgDir, 'dist'), { recursive: true });
  writeFileSync(join(pkgDir, 'dist/index.js'), js);
  // Minimal type declaration so TypeScript consumers get types
  writeFileSync(join(pkgDir, 'dist/index.d.ts'), `import type { Config } from '@lapidist/design-lint';\ndeclare const preset: Config;\nexport default preset;\n`);

  console.log(`build-presets: ${preset} ✓`);
}
