import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, placeholder, pointerTemplate } from '@dtifx/build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(__dirname, '..');
const artifactDir = resolve(repositoryRoot, 'ops', 'artifacts', 'dscp');

// Dedicated build config for DESIGN_SYSTEM.md generation.
// Only processes catalog.tokens.json — the catalog already inlines all tokens
// from foundations.json, components/, and themes/ — so processing the individual
// source files alongside it would produce duplicate token entries in the output.
export default defineConfig({
  layers: [{ name: 'default' }],
  sources: [
    {
      id: 'catalog',
      kind: 'file',
      layer: 'default',
      rootDir: resolve(repositoryRoot, 'tokens'),
      patterns: ['catalog.tokens.json'],
      pointerTemplate: pointerTemplate(placeholder('stem')),
    },
  ],
  formatters: [
    {
      name: 'json.snapshot',
      output: { directory: artifactDir },
    },
  ],
});
