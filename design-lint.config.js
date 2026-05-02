export default {
  patterns: ['src/**/*.{css,js,jsx,ts,tsx}'],
  ignoreFiles: ['ops/artifacts/**'],
  // tokens: path reference used by `design-lint kernel start --config-path` to seed
  // the DSR kernel on startup. The linter itself reads tokens from the running kernel
  // via DSQL — it does not load this field at lint time.
  tokens: {
    default: './tokens/catalog.json',
  },
  rules: {
    'design-token/colors': 'error',
    'design-token/spacing': ['error', { base: 0 }],
    'design-token/duration': 'error',
    'design-system/no-inline-styles': ['error', { components: ['Button'] }],
  },
};
