const tokens = require('./tokens/index.dtif.json');

module.exports = {
  patterns: ['tokens/**/*.dtif.json'],
  ignoreFiles: ['ops/artifacts/**'],
  tokens: {
    default: tokens,
  },
  rules: {
    'design-token/colors': 'error',
    'design-token/spacing': 'error',
  },
};
