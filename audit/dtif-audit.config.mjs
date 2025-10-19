import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, placeholder, pointerTemplate } from '@dtifx/build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(__dirname, '..');

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
  audit: {
    policies: [
      {
        name: 'governance.requireOwner',
        options: {
          extension: 'lapidist.governance',
          field: 'owner',
          severity: 'warning',
          message: 'Token is missing governance owner metadata.',
        },
      },
    ],
  },
});
