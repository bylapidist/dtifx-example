/* eslint-env node */

import { createHash } from 'node:crypto';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function resolveRepoRoot() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  return resolve(scriptDir, '..');
}

function toHexComponent(value) {
  const normalized = Math.round(Math.min(1, Math.max(0, value)) * 255);
  return normalized.toString(16).padStart(2, '0').toUpperCase();
}

function formatTokenValue(token) {
  const { $type: type, $value: value } = token;
  if (!value) {
    return undefined;
  }
  if (type === 'color' && value.components) {
    return `#${value.components.map(toHexComponent).join('')}`;
  }
  if (type === 'dimension' && typeof value.value === 'number' && typeof value.unit === 'string') {
    if (value.unit === 'unitless' || value.unit === 'scalar.unitless') {
      return `${value.value}`;
    }
    if (value.unit === 'duration.ms') {
      return `${value.value}ms`;
    }
    return `${value.value}${value.unit}`;
  }
  if (type === 'duration' && typeof value.value === 'number' && typeof value.unit === 'string') {
    return `${value.value}${value.unit}`;
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return String(value);
  }
  if (typeof value.value === 'number') {
    return String(value.value);
  }
  return undefined;
}

function pathToVariable(pathParts) {
  return pathParts.join('-').toLowerCase();
}

function determineSource(pathParts) {
  const [root] = pathParts;
  switch (root) {
    case 'component':
      return 'tokens/components/button.dtif.json';
    case 'color':
    case 'spacing':
    case 'fontWeights':
    case 'fontWeightVariables':
    case 'durations':
    case 'durationVariables':
      return 'tokens/foundations.dtif.json';
    default:
      return 'tokens/index.dtif.json';
  }
}

async function hashFile(path) {
  const content = await readFile(path);
  const hash = createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

function collectTokens(tree, pathParts = []) {
  const entries = [];
  for (const [key, value] of Object.entries(tree)) {
    if (!value || typeof value !== 'object') {
      continue;
    }
    if ('$type' in value && '$value' in value) {
      const tokenPath = [...pathParts, key];
      entries.push({
        path: tokenPath.join('.'),
        variable: pathToVariable(tokenPath),
        source: determineSource(tokenPath),
        value: formatTokenValue(value),
        description: value.$description ?? '',
        tokenType: value.$type,
      });
      continue;
    }
    if (key.startsWith('$')) {
      continue;
    }
    entries.push(...collectTokens(value, [...pathParts, key]));
  }
  return entries;
}

function collectOverrides(indexDoc, overrideSourceIndex, tokenVariableIndex) {
  if (!Array.isArray(indexDoc.$overrides)) {
    return [];
  }
  return indexDoc.$overrides.map((entry) => {
    const when = entry.$when ?? {};
    const key = JSON.stringify({ token: entry.$token, when });
    const source = overrideSourceIndex.get(key) ?? 'tokens/themes/light.dtif.json';
    const targetPath = entry.$token.replace('#/', '').split('/').join('.');
    const variable = tokenVariableIndex.get(targetPath) ?? pathToVariable(targetPath.split('.'));
    return {
      token: `${source}${entry.$token}`,
      conditions: when,
      theme: when.theme ?? 'light',
      value: formatTokenValue({ $type: 'color', $value: entry.$value }) ?? '',
      source,
      variable,
    };
  });
}

async function createOverrideIndex(repoRoot, sources) {
  const map = new Map();
  for (const source of sources) {
    if (!source.startsWith('tokens/themes/')) {
      continue;
    }
    const absolutePath = resolve(repoRoot, source);
    const raw = await readFile(absolutePath, 'utf8');
    const document = JSON.parse(raw);
    if (!Array.isArray(document.$overrides)) {
      continue;
    }
    for (const override of document.$overrides) {
      const when = override.$when ?? {};
      const key = JSON.stringify({ token: override.$token, when });
      map.set(key, source);
    }
  }
  return map;
}

async function buildRegistry() {
  const repoRoot = resolveRepoRoot();
  const tokensDir = resolve(repoRoot, 'tokens');
  const indexPath = resolve(tokensDir, 'index.dtif.json');
  const indexRaw = await readFile(indexPath, 'utf8');
  const indexDoc = JSON.parse(indexRaw);
  const catalogSources = indexDoc.$extensions?.['lapidist.catalog']?.sources ?? [];
  const sourcePaths = catalogSources.map((relative) => `tokens/${relative.replace(/^\.\//, '')}`);
  const documents = [];
  for (const relative of sourcePaths) {
    const absolute = resolve(repoRoot, relative);
    const raw = await readFile(absolute, 'utf8');
    const hash = await hashFile(absolute);
    const doc = JSON.parse(raw);
    documents.push({
      path: relative,
      hash,
      description: doc.$description ?? '',
    });
  }
  const overrideSourceIndex = await createOverrideIndex(repoRoot, sourcePaths);
  const tokens = collectTokens(indexDoc).sort((a, b) => a.path.localeCompare(b.path));
  const tokenVariableIndex = new Map(tokens.map((token) => [token.path, token.variable]));
  const overrides = collectOverrides(indexDoc, overrideSourceIndex, tokenVariableIndex).sort((a, b) =>
    a.token.localeCompare(b.token),
  );
  documents.sort((a, b) => a.path.localeCompare(b.path));
  const generatedAt = new Date().toISOString();
  const registry = {
    generatedAt,
    stats: {
      documents: documents.length,
      tokens: tokens.length,
      overrides: overrides.length,
    },
    documents,
    tokens,
    overrides,
  };
  const registryPath = resolve(repoRoot, 'ops', 'artifacts', 'build', 'registry.json');
  await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  return { repoRoot, generatedAt, documents, tokens, overrides };
}

async function buildTelemetry(context) {
  const { repoRoot, generatedAt, documents, tokens, overrides } = context;
  const outputs = [
    { name: 'registry-manifest', format: 'json', output: 'ops/artifacts/build/registry.json' },
    { name: 'ui-css-variables', format: 'css', output: 'ops/artifacts/build/tokens.css' },
    { name: 'ui-json', format: 'json', output: 'ops/artifacts/build/tokens.json' },
  ];
  const resolvedOutputs = await Promise.all(
    outputs.map(async (entry) => {
      const stats = await stat(resolve(repoRoot, entry.output));
      return {
        ...entry,
        includeThemes: false,
        bytes: stats.size,
      };
    }),
  );
  const telemetry = {
    generatedAt,
    config: 'build/dtif-build.config.mjs',
    sources: documents.map(({ path, hash }) => ({ path, hash })),
    outputs: resolvedOutputs,
    stats: {
      documents: documents.length,
      tokens: tokens.length,
      overrides: overrides.length,
    },
    referenceDocs: {
      build: 'https://github.com/bylapidist/dtifx/blob/main/docs/build/index.md',
      overrides: 'https://github.com/bylapidist/dtifx/blob/main/docs/spec/theming-overrides.md',
    },
  };
  const telemetryPath = resolve(repoRoot, 'ops', 'artifacts', 'build', 'telemetry.json');
  await writeFile(telemetryPath, `${JSON.stringify(telemetry, null, 2)}\n`, 'utf8');
}

async function main() {
  const context = await buildRegistry();
  await buildTelemetry(context);
}

main().catch((error) => {
  console.error('[update-build-metadata] Failed to refresh registry metadata:', error);
  process.exitCode = 1;
});
