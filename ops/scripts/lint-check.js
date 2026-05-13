/**
 * Programmatic design-lint API demonstration.
 *
 * Uses the stable Node.js API surface from the design-lint v8 docs:
 *   loadConfig        — resolve designlint.config.js from the project root
 *   createNodeEnvironment — build the DSR-backed token environment
 *   createLinter      — instantiate the linter engine
 *   lintTargets       — lint file globs and return LintResult[]
 *   getTokenCompletions — list available token paths grouped by theme
 *   getFormatter      — load a named built-in formatter
 *
 * Prerequisites: DSR kernel must be running (pnpm run kernel:start).
 *
 * Usage: node ops/scripts/lint-check.js
 */
import {
  loadConfig,
  createLinter,
  createNodeEnvironment,
  getFormatter,
} from '@lapidist/design-lint';

async function main() {
  const cwd = process.cwd();

  // 1. Resolve configuration from the project root
  const config = await loadConfig(cwd);

  // 2. Create the DSR-backed Node environment (kernel must be running)
  const env = createNodeEnvironment(config, {
    dsr: { socketPath: '/tmp/designlint-kernel.sock' },
  });

  // 3. Instantiate the linter
  const linter = createLinter(config, env);

  // 4. Lint source files via glob
  const { results } = await linter.lintTargets(['src/**/*.{css,js,jsx,ts,tsx}']);

  // 5. Query available token completions from the running kernel
  const completions = await linter.getTokenCompletions();
  const totalTokens = Object.values(completions).flat().length;

  // 6. Format and print results using the built-in stylish formatter
  const formatter = await getFormatter('stylish');
  const output = formatter(results);
  if (output) process.stdout.write(output + '\n');

  const errors = results.reduce((n, r) => n + r.messages.filter(m => m.severity === 'error').length, 0);
  const warnings = results.reduce((n, r) => n + r.messages.filter(m => m.severity === 'warn').length, 0);

  console.log(`\nToken completions available: ${totalTokens} across ${Object.keys(completions).length} theme(s)`);
  console.log(`Summary: ${errors} errors, ${warnings} warnings across ${results.length} file(s)`);

  process.exitCode = errors > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
