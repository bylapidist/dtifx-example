import { defineConfig } from '@lapidist/design-lint';
import recommended from '@lapidist/design-lint-config-recommended';
import aiAgent from '@lapidist/design-lint-config-ai-agent';

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
    // Tighten: ai-agent preset
    ...aiAgent.rules,

    // Project overrides
    // warn (not error): our build prefixes CSS var names with the source-file
    // stem (e.g. --catalog-tokens-clr-brand) which doesn't match the
    // pointer-derived name the provenance rule expects (--clr-brand).
    'design-token/css-var-provenance': 'warn',
    'design-token/composite-equivalence': 'warn',
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
