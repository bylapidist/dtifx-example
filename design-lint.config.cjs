const tokens = require('./tokens/index.dtif.json');

module.exports = {
  patterns: ['src/**/*.{css,js,jsx,ts,tsx}'],
  ignoreFiles: ['ops/artifacts/**'],
  tokens: {
    default: tokens,
  },
  rules: {
    'design-token/colors': 'error',
    'design-token/spacing': 'error',
  },
};
