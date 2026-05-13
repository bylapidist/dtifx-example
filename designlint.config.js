import { defineConfig } from '@lapidist/design-lint';

/**
 * Rule sets inlined from published preset packages (dist not yet shipped):
 *   @lapidist/design-lint-config-recommended
 *   @lapidist/design-lint-config-ai-agent
 *
 * When the presets ship compiled dist files, replace these objects with:
 *   import recommended from '@lapidist/design-lint-config-recommended';
 *   import aiAgent     from '@lapidist/design-lint-config-ai-agent';
 *   export default defineConfig({ ...recommended, ...aiAgent, rules: { ...recommended.rules, ...aiAgent.rules, /* overrides *\/ } });
 */
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
    'design-token/css-var-provenance': 'warn', // warn: our CSS vars use build-prefixed names
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
    // Spread ai-agent preset rules on top (tightens several rules)
    ...aiAgent.rules,

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
