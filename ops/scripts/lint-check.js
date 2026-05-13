/**
 * Programmatic design-lint API demonstration.
 *
 * Stable API surface demonstrated (v8 docs → API reference):
 *   loadConfig           — resolve designlint.config.js from the project root
 *   createNodeEnvironment — build the DSR-backed token environment
 *   createLinter         — instantiate the linter engine
 *   lintTargets          — lint file globs, returns LintResult[]
 *   lintDocument         — lint a single preloaded document object
 *   getTokenCompletions  — list available token paths grouped by theme
 *   getFormatter         — load a named built-in formatter
 *   applyFixes           — apply auto-fix messages to source text in memory
 *
 * Prerequisites: DSR kernel must be running (pnpm run kernel:start).
 * Usage:         node ops/scripts/lint-check.js
 */
import {
  loadConfig,
  createLinter,
  createNodeEnvironment,
  getFormatter,
  applyFixes,
} from '@lapidist/design-lint';

const DSR_SOCKET = '/tmp/designlint-kernel.sock';

async function main() {
  const cwd = process.cwd();

  // 1. Resolve configuration from the project root
  const config = await loadConfig(cwd);

  // 2. Create the DSR-backed Node environment (kernel must be running)
  const env = createNodeEnvironment(config, {
    dsr: { socketPath: DSR_SOCKET },
  });

  // 3. Instantiate the linter
  const linter = createLinter(config, env);

  // 4a. Lint source files via glob (lintTargets)
  const { results } = await linter.lintTargets(['src/**/*.{css,js,jsx,ts,tsx,scss}']);

  // 4b. Lint a single in-memory document (lintDocument)
  //     Useful for editor integrations or CI scripts that already have text.
  const inMemoryDoc = {
    id: 'virtual:inline-check.css',
    type: 'css',
    getText: async () => '.example { color: var(--catalog-tokens-clr-brand); }',
  };
  const { result: inMemoryResult } = await linter.lintDocument(inMemoryDoc);
  results.push(inMemoryResult);

  // 5. Apply in-memory auto-fixes (applyFixes) — returns patched source text
  //    This is what --fix does internally; useful for programmatic pipelines.
  const sampleSource = '.bad { color: #ff0000; }';
  const fixMessages = results.flatMap((r) => r.messages.filter((m) => m.fix));
  const patched = applyFixes(sampleSource, fixMessages);
  if (patched !== sampleSource) {
    console.log('applyFixes patched source (auto-fixable violations found)');
  }

  // 6. Query available token completions from the running kernel
  const completions = await linter.getTokenCompletions();
  const totalTokens = Object.values(completions).flat().length;

  // 7. Format and print results using the built-in stylish formatter
  const formatter = await getFormatter('stylish');
  const output = formatter(results);
  if (output) process.stdout.write(output + '\n');

  const errors = results.reduce((n, r) => n + r.messages.filter((m) => m.severity === 'error').length, 0);
  const warnings = results.reduce((n, r) => n + r.messages.filter((m) => m.severity === 'warn').length, 0);

  console.log(`Token completions: ${totalTokens} across ${Object.keys(completions).length} theme(s)`);
  console.log(`Summary: ${errors} errors, ${warnings} warnings across ${results.length} file(s)`);

  process.exitCode = errors > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
