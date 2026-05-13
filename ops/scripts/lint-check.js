/**
 * Programmatic design-lint API demonstration.
 *
 * Stable API surface demonstrated (v8 docs → API reference):
 *   loadConfig            — resolve designlint.config.js from the project root
 *   createNodeEnvironment — build the DSR-backed token environment
 *   createLinter          — instantiate the full linter (lintTargets, lintDocument, lintDocuments, getTokenCompletions)
 *   createLintService     — instantiate the simplified lint service (lintTargets only)
 *   setupLinter           — low-level linter bootstrap (returns the same Linter as createLinter)
 *   lintTargets           — lint file globs, returns LintResult[]
 *   lintDocument          — lint a single preloaded in-memory document
 *   lintDocuments         — batch lint multiple in-memory documents
 *   getTokenCompletions   — list available token paths grouped by theme
 *   getFormatter          — load a named built-in formatter
 *   applyFixes            — apply auto-fix messages to source text in memory
 *   parseInlineDtifTokens — parse an inline DTIF JSON string without a file
 *
 * Prerequisites: DSR kernel must be running (pnpm run kernel:start).
 * Usage:         node ops/scripts/lint-check.js
 */
import {
  loadConfig,
  createLinter,
  createLintService,
  setupLinter,
  createNodeEnvironment,
  getFormatter,
  applyFixes,
  parseInlineDtifTokens,
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

  // 3a. createLinter — full linter with all methods
  const linter = createLinter(config, env);

  // 3b. createLintService — simplified service exposing only lintTargets
  //     Useful when you only need glob-based linting without document APIs.
  const service = createLintService(config, env);

  // 3c. setupLinter — low-level bootstrap; returns the same Linter as createLinter.
  //     Use when you need to manage the linter lifecycle directly.
  const linter2 = setupLinter(config, env);
  void linter2; // same interface as linter, demonstrating the alternative entry point

  // 4. lintTargets — lint source files via glob
  const { results } = await linter.lintTargets([
    'src/**/*.{css,scss,less,js,jsx,ts,tsx}',
  ]);

  // 5. lintDocument — lint a single in-memory document
  //    Useful for editor integrations or CI scripts with pre-loaded text.
  const inMemoryDoc = {
    id: 'virtual:inline-check.css',
    type: 'css',
    getText: async () => '.example { color: var(--catalog-tokens-clr-brand); }',
  };
  const { result: inMemoryResult } = await linter.lintDocument(inMemoryDoc);
  results.push(inMemoryResult);

  // 6. lintDocuments — batch lint multiple in-memory documents at once
  const batchDocs = [
    {
      id: 'virtual:a.css',
      type: 'css',
      getText: async () => '.a { background-color: var(--catalog-tokens-cmp-btn-bg); }',
    },
    {
      id: 'virtual:b.css',
      type: 'css',
      getText: async () => '.b { color: var(--catalog-tokens-cmp-btn-fg); }',
    },
  ];
  const batchResults = await linter.lintDocuments(batchDocs);
  results.push(...batchResults.map((r) => r.result));

  // 7. createLintService.lintTargets — same as linter.lintTargets
  const { results: serviceResults } = await service.lintTargets([
    'src/**/*.css',
  ]);
  void serviceResults; // demonstrating the service interface

  // 8. parseInlineDtifTokens — parse an inline DTIF JSON string without a file on disk.
  //    Useful for editor extensions that receive token data over a network or IPC.
  const inlineDtif = JSON.stringify({
    $version: '1.0.0',
    color: {
      accent: {
        $type: 'color',
        $value: { colorSpace: 'srgb', components: [0.054901960784313725, 0.3607843137254902, 0.6784313725490196] },
      },
    },
  });
  const { tokens: inlineTokens, diagnostics: inlineDiag } = await parseInlineDtifTokens(
    inlineDtif,
    { uri: 'virtual://runtime-tokens.tokens.json' },
  );
  console.log(`\nparseInlineDtifTokens: ${Object.keys(inlineTokens ?? {}).length} token groups, ${inlineDiag?.length ?? 0} diagnostic(s)`);

  // 9. applyFixes — apply in-memory auto-fixes (what --fix does internally)
  const sampleSource = '.bad { background-color: var(--catalog-tokens-cmp-btn-bg); }';
  const fixMessages = results.flatMap((r) => r.messages.filter((m) => m.fix));
  const patched = applyFixes(sampleSource, fixMessages);
  if (patched !== sampleSource) process.stdout.write('applyFixes: source patched\n');

  // 10. getTokenCompletions — query available token paths from the running kernel
  const completions = await linter.getTokenCompletions();
  const totalTokens = Object.values(completions).flat().length;

  // 11. Format and print results using the built-in stylish formatter
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
