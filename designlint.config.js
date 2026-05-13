import { defineConfig } from '@lapidist/design-lint';

// Preset rule sets — inlined from source because the preset packages
// (@lapidist/design-lint-config-recommended, -ai-agent) do not ship
// compiled dist files. Values are taken verbatim from their src/index.ts.
const recommended = {
  rules: {
    'design-token/colors': 'warn',
    'design-token/spacing': 'warn',
    'design-token/easing': 'warn',
    'design-token/css-var-provenance': 'warn',
    'design-token/composite-equivalence': 'warn',
    'design-system/deprecation': 'warn',
    'design-system/jsx-style-values': 'warn',
    'design-system/no-hardcoded-spacing': 'warn',
  },
};

const aiAgent = {
  rules: {
    'design-token/easing': 'error',
    // warn (not error): our build prefixes CSS var names with the source-file
    // stem (e.g. --catalog-tokens-clr-brand), which doesn't match the
    // pointer-derived name the provenance rule expects (--clr-brand).
    'design-token/css-var-provenance': 'warn',
    'design-token/composite-equivalence': 'warn',
    'design-system/jsx-style-values': 'error',
    'design-system/no-hardcoded-spacing': 'error',
  },
};

export default defineConfig({
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
    // Base: recommended preset
    ...recommended.rules,
    // Tighten: ai-agent preset (easing → error, jsx-style-values → error, etc.)
    ...aiAgent.rules,

    // Project overrides
    'design-token/colors': 'error',
    'design-token/border-color': 'warn',
    'design-token/spacing': ['error', { base: 0 }],
    'design-token/duration': 'error',
    'design-token/animation': 'warn',
    'design-token/font-family': 'error',
    'design-token/font-size': 'error',
    'design-token/font-weight': 'error',
    'design-token/line-height': 'warn',
    'design-token/letter-spacing': 'error',
    'design-token/border-radius': 'error',
    'design-token/border-width': 'warn',
    'design-token/box-shadow': 'error',
    'design-token/outline': 'error',
    'design-token/blur': 'warn',
    'design-token/opacity': 'error',
    'design-token/z-index': 'warn',
    'design-system/no-inline-styles': ['error', { components: ['Button'] }],
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
    'design-system/no-unused-tokens': 'warn',
  },
});
