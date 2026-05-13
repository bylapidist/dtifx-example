/**
 * Build the design-lint preset packages' TypeScript source into ESM dist files.
 *
 * The preset packages (@lapidist/design-lint-config-recommended, -strict,
 * -ai-agent) ship TypeScript source but no compiled output. This script runs
 * their build step using the project's local tsc so the presets are importable
 * from designlint.config.js.
 *
 * Runs automatically via the "prepare" lifecycle hook after pnpm install.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../../..');
const tsc = join(root, 'node_modules/.bin/tsc');
const PRESETS = ['recommended', 'strict', 'ai-agent'];

if (!existsSync(tsc)) {
  console.warn('build-presets: tsc not found, skipping preset build');
  process.exit(0);
}

for (const preset of PRESETS) {
  const tsconfig = join(root, `node_modules/@lapidist/design-lint-config-${preset}/tsconfig.json`);
  if (!existsSync(tsconfig)) {
    console.warn(`build-presets: ${preset} tsconfig not found, skipping`);
    continue;
  }
  try {
    execFileSync(tsc, ['-p', tsconfig], { stdio: 'inherit' });
    console.log(`build-presets: built ${preset}`);
  } catch {
    console.warn(`build-presets: failed to build ${preset}, continuing`);
  }
}
