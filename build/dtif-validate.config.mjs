import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, placeholder, pointerTemplate } from '@dtifx/build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(__dirname, '..');
const tokensRoot = resolve(repositoryRoot, 'tokens');

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(tokensRoot, relativePath), 'utf8'));
}

const catalogDocument = readJson('catalog.json');
const darkThemeDocument = readJson('themes/dark.json');
const lightThemeDocument = readJson('themes/light.json');

const { $overrides: _catalogOverrides, ...catalogWithoutOverrides } = catalogDocument;

function buildThemeValidationDocument(themeDocument, description) {
  return {
    ...catalogWithoutOverrides,
    $description: description,
    $overrides: themeDocument.$overrides ?? [],
  };
}

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
      rootDir: tokensRoot,
      patterns: ['catalog.json', 'foundations.json', 'components/*.json'],
      pointerTemplate: pointerTemplate(placeholder('stem')),
    },
    {
      id: 'dark-theme-overrides',
      kind: 'virtual',
      layer: 'default',
      pointerTemplate: pointerTemplate('dark-theme-overrides'),
      document: () =>
        buildThemeValidationDocument(
          darkThemeDocument,
          'Validation view: dark theme overrides applied against catalog token targets.'
        ),
    },
    {
      id: 'light-theme-overrides',
      kind: 'virtual',
      layer: 'default',
      pointerTemplate: pointerTemplate('light-theme-overrides'),
      document: () =>
        buildThemeValidationDocument(
          lightThemeDocument,
          'Validation view: light theme overrides applied against catalog token targets.'
        ),
    },
  ],
});
