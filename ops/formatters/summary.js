/**
 * Custom design-lint formatter — compact one-line summary.
 *
 * Usage: design-lint "src/**\/*" --format ./ops/formatters/summary.js
 *
 * Demonstrates the custom formatter API from the design-lint v8 docs.
 * A formatter receives LintResult[] and returns a string.
 */
export default function summaryFormatter(results) {
  let errors = 0;
  let warnings = 0;
  const violated = [];

  for (const result of results) {
    for (const msg of result.messages) {
      if (msg.severity === 2 || msg.severity === 'error') errors++;
      else if (msg.severity === 1 || msg.severity === 'warn') warnings++;
    }
    if (result.messages.length > 0) violated.push(result.sourceId);
  }

  const fileCount = results.length;
  const violatedCount = violated.length;
  const status = errors === 0 ? '✓' : '✗';

  return [
    `${status} design-lint: ${errors} errors, ${warnings} warnings across ${fileCount} file(s)`,
    violatedCount > 0 ? `  Files with issues: ${violated.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
