/* eslint-env node */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import {
  createTokenSetFromTree,
  diffTokenSets,
  formatDiffAsJson,
  formatDiffAsMarkdown,
} from '@dtifx/diff';

async function run() {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const baselinePath = resolve(repoRoot, 'ops', 'artifacts', 'diff', 'baseline.dtif.json');
  const nextPath = resolve(repoRoot, 'tokens', 'index.dtif.json');
  const canonicalSource = resolve(repoRoot, 'tokens', 'index.dtif.json');

  const startedAt = new Date();
  const start = performance.now();

  const [baselineTreeRaw, nextTreeRaw] = await Promise.all([
    readFile(baselinePath, 'utf8'),
    readFile(nextPath, 'utf8'),
  ]);

  const baselineTree = JSON.parse(baselineTreeRaw);
  const nextTree = JSON.parse(nextTreeRaw);

  const previousSet = createTokenSetFromTree(baselineTree, { source: canonicalSource });
  const nextSet = createTokenSetFromTree(nextTree, { source: canonicalSource });

  const diff = diffTokenSets(previousSet, nextSet);

  const durationMs = Math.round(performance.now() - start);

  const runContext = {
    previous: 'ops/artifacts/diff/baseline.dtif.json (normalized)',
    next: 'tokens/index.dtif.json',
    startedAt: startedAt.toISOString(),
    durationMs,
  };

  const jsonReport = formatDiffAsJson(diff, { runContext });
  const markdownReport = formatDiffAsMarkdown(diff, { runContext });

  const jsonPath = resolve(repoRoot, 'ops', 'artifacts', 'diff', 'report.json');
  const markdownPath = resolve(repoRoot, 'ops', 'artifacts', 'diff', 'report.md');

  await Promise.all([
    writeFile(jsonPath, `${jsonReport}\n`, 'utf8'),
    writeFile(markdownPath, markdownReport.endsWith('\n') ? markdownReport : `${markdownReport}\n`, 'utf8'),
  ]);
}

run().catch((error) => {
  console.error('[dtif-diff-normalized] Diff generation failed:', error);
  process.exitCode = 1;
});
