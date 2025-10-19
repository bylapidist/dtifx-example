#!/usr/bin/env node
import process from 'node:process';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(__dirname, '..');
const artifactDir = resolve(repositoryRoot, 'ops', 'artifacts', 'audit');
const configPath = resolve(repositoryRoot, 'audit', 'dtif-audit.config.mjs');
const cliBin = resolve(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'dtifx.cmd' : 'dtifx',
);

await mkdir(artifactDir, { recursive: true });

async function runAudit(format) {
  const args = ['audit', 'run', '--config', configPath, '--reporter', format];
  const stdout = await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cliBin, args, {
      cwd: repositoryRoot,
      env: { ...process.env, DTIFX_LOG_LEVEL: 'off' },
      stdio: ['ignore', 'pipe', 'inherit'],
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });

    child.on('error', (error) => rejectPromise(error));
    child.on('close', (code) => {
      if (code !== 0) {
        rejectPromise(new Error(`dtifx audit run (${format}) exited with code ${code}`));
        return;
      }
      resolvePromise(output);
    });
  });

  const cleaned = stdout
    .split(/\r?\n/)
    .filter((line) => !line.startsWith('[info]'))
    .join('\n')
    .trim();

  if (!cleaned) {
    throw new Error(`dtifx audit run (${format}) did not produce any reporter output`);
  }

  return cleaned;
}

const jsonReport = await runAudit('json');
let formattedJson = jsonReport;
try {
  formattedJson = JSON.stringify(JSON.parse(jsonReport), null, 2);
} catch (error) {
  throw new Error(`Failed to parse audit JSON output: ${error instanceof Error ? error.message : String(error)}`);
}
await writeFile(resolve(artifactDir, 'report.json'), `${formattedJson}\n`);

const markdownReport = await runAudit('markdown');
await writeFile(resolve(artifactDir, 'report.md'), `${markdownReport}\n`);
