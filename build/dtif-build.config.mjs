import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, placeholder, pointerTemplate } from '@dtifx/build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(__dirname, '..');
const artifactDir = resolve(repositoryRoot, 'ops', 'artifacts', 'build');

export default defineConfig({
  layers: [
    {
      name: 'default',
    },
  ],
  sources: [
    {
      id: 'tokens',
      kind: 'file',
      layer: 'default',
      rootDir: resolve(repositoryRoot, 'tokens'),
      patterns: ['**/*.dtif.json'],
      pointerTemplate: pointerTemplate('tokens', placeholder('relative')),
    },
  ],
  formatters: [
    {
      name: 'json.snapshot',
      output: {
        directory: artifactDir,
      },
    },
    {
      name: 'css.variables',
      output: {
        directory: artifactDir,
      },
    },
  ],
});
