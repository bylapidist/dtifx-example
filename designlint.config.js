import { defineConfig } from '@lapidist/design-lint';
// Preset packages built by ops/scripts/build-presets.js (runs via prepare hook)
import recommended from '@lapidist/design-lint-config-recommended';
import aiAgent from '@lapidist/design-lint-config-ai-agent';

// ai-agent preset overrides — loosen rules that conflict with our build-prefixed
// CSS var naming convention (--catalog-tokens-* vs --* expected by provenance rule)
const aiAgentOverrides = {
  rules: {
    ...aiAgent.rules,
    'design-token/css-var-provenance': 'warn', // warn: build adds stem prefix to var names
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
    // Spread recommended preset rules as the base layer
    ...recommended.rules,
    // Spread ai-agent overrides on top (tightens easing, jsx-style-values, etc.)
    ...aiAgentOverrides.rules,

    // Project overrides on top of presets
    // Color
    'design-token/colors': 'error',
    'design-token/border-color': 'warn',

    // Spacing & layout
    'design-token/spacing': ['error', { base: 0 }],

    // Motion
    'design-token/duration': 'error',
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

    // Component usage
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

    // Governance
    'design-system/no-unused-tokens': 'warn',
  },
});
