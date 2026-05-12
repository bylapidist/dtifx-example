export default {
  patterns: ['src/**/*.{css,js,jsx,ts,tsx}'],
  ignoreFiles: ['ops/artifacts/**'],
  format: 'stylish',
  concurrency: 4,
  nameTransform: 'kebab-case',
  tokens: {
    default: './tokens/catalog.tokens.json',
  },
  rules: {
    // Color
    'design-token/colors': 'error',
    'design-token/border-color': 'warn',

    // Spacing & layout
    'design-token/spacing': ['error', { base: 0 }],
    'design-system/no-hardcoded-spacing': 'warn',

    // Motion
    'design-token/duration': 'error',
    'design-token/easing': 'error',

    // Typography
    'design-token/font-family': 'error',
    'design-token/font-size': 'error',
    'design-token/font-weight': 'error',
    'design-token/line-height': 'warn',
    'design-token/letter-spacing': 'error',

    // Shape & decoration
    'design-token/border-radius': 'error',
    'design-token/border-width': 'warn',
    // design-token/box-shadow omitted: shadow $type is not supported by this dtifx DTIF schema version
    'design-token/outline': 'error',

    // Surface
    'design-token/opacity': 'error',
    'design-token/z-index': 'warn',

    // Composite / provenance
    'design-token/composite-equivalence': 'warn',

    // Component usage
    'design-system/no-inline-styles': ['error', { components: ['Button'] }],
    'design-system/jsx-style-values': 'warn',
    'design-system/variant-prop': ['warn', {
      prop: 'variant',
      components: { Button: ['primary', 'secondary'] },
    }],

    // Governance
    'design-system/deprecation': 'warn',
    'design-system/no-unused-tokens': 'warn',
  },
};
