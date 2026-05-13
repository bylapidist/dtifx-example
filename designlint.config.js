export default {
  patterns: ['src/**/*.{css,js,jsx,ts,tsx,scss,less,vue,svelte}'],
  ignoreFiles: ['ops/artifacts/**'],
  format: 'stylish',
  concurrency: 4,
  nameTransform: 'kebab-case',
  templateTags: ['styled', 'css', 'tw'],
  tokens: {
    default: './tokens/catalog.tokens.json',
  },
  plugins: ['./ops/plugins/dtifx-rules.js'],
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
    'design-token/animation': 'warn',

    // Typography
    'design-token/font-family': 'error',
    'design-token/font-size': 'error',
    'design-token/font-weight': 'error',
    'design-token/line-height': 'warn',
    'design-token/letter-spacing': 'error',

    // Shape & decoration
    'design-token/border-radius': 'error',
    'design-token/border-width': 'warn',
    'design-token/box-shadow': 'error',
    'design-token/outline': 'error',
    'design-token/blur': 'warn',

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
    'design-system/component-usage': ['warn', { substitutions: { button: 'Button' } }],
    'design-system/icon-usage': ['warn', { substitutions: { svg: 'Icon' } }],
    'design-system/import-path': ['warn', {
      packages: ['@dtifx/design-system'],
      components: ['Button'],
    }],
    'design-system/component-prefix': ['warn', {
      prefix: 'DS',
      components: ['Button'],
    }],

    // Custom plugin rule
    'dtifx/no-hardcoded-color-values': 'warn',

    // Governance
    'design-system/deprecation': 'warn',
    'design-system/no-unused-tokens': 'warn',
  },
};
