export default {
  patterns: ['src/**/*.{css,js,jsx,ts,tsx}'],
  ignoreFiles: ['ops/artifacts/**'],
  rules: {
    'design-token/colors': 'error',
    'design-token/spacing': ['error', { base: 0 }],
    'design-token/duration': 'error',
    'design-system/no-inline-styles': ['error', { components: ['Button'] }],
  },
};
