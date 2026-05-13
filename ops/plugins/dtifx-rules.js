/**
 * Custom design-lint plugin for the DTIFx example stack.
 *
 * Demonstrates the full plugin API surface from the design-lint v8 docs:
 *   RuleModule.meta.schema  — Zod schema for validated rule options
 *   RuleModule.create()     — rule factory receiving typed RuleContext
 *   ctx.getDtifTokens()     — access the kernel's canonical DTIF token graph
 *   ctx.getTokenPath()      — derive dot-delimited paths with name transform
 *   ctx.options             — typed, Zod-validated options from config
 *   ctx.report()            — surface a violation with file location
 *   PluginModule.init(env)  — optional lifecycle hook for setup logic
 *   PluginModule.name/version — plugin metadata
 *
 * The rule is loaded via plugins: ['./ops/plugins/dtifx-rules.js'] in
 * designlint.config.js. Enable it by adding
 * 'dtifx/no-hardcoded-color-values': 'warn' to your rules config.
 */
import { z } from 'zod';

/**
 * Options schema — validated by the design-lint engine before create() runs.
 * If the user passes invalid options, the engine rejects the config with a
 * clear error message.
 */
const optionsSchema = z.object({
  properties: z
    .array(z.string())
    .optional()
    .describe('CSS property names to check. Defaults to standard color properties.'),
  allowNamedColors: z
    .boolean()
    .optional()
    .describe('When true, named CSS color keywords (e.g. "red") are allowed.'),
});

/**
 * dtifx/no-hardcoded-color-values
 *
 * Flags raw color literals on CSS color properties when registered DTIF
 * color tokens are available in the DSR kernel. Demonstrates:
 * - meta.schema with Zod (typed, validated options)
 * - getDtifTokens('color') to read the live token graph
 * - getTokenPath(token) with the configured nameTransform
 * - ctx.options for user-supplied config values
 */
const noHardcodedColorValues = {
  name: 'dtifx/no-hardcoded-color-values',
  meta: {
    description:
      'Require color CSS properties to reference a registered design token CSS variable instead of a raw literal.',
    schema: optionsSchema,
  },
  create(ctx) {
    const colorTokens = ctx.getDtifTokens('color');
    const tokenPaths = colorTokens.map((t) => ctx.getTokenPath(t));

    const checkedProps = ctx.options?.properties ?? [
      'color',
      'background-color',
      'border-color',
      'fill',
      'stroke',
    ];
    const allowNamedColors = ctx.options?.allowNamedColors ?? false;

    return {
      onCSSDeclaration(decl) {
        if (!checkedProps.includes(decl.prop)) return;
        if (decl.value.startsWith('var(')) return;

        const isHex = /^#[0-9a-fA-F]{3,8}$/.test(decl.value);
        const isRgb = /^rgba?\(/.test(decl.value);
        const isHsl = /^hsla?\(/.test(decl.value);
        const isNamed = allowNamedColors ? false : /^[a-z]+$/.test(decl.value) && decl.value !== 'transparent' && decl.value !== 'inherit' && decl.value !== 'currentcolor';

        if (isHex || isRgb || isHsl || isNamed) {
          const hint =
            tokenPaths.length > 0
              ? ` Use one of: ${tokenPaths.slice(0, 3).join(', ')}${tokenPaths.length > 3 ? '…' : ''}`
              : '';
          ctx.report({
            message: `dtifx: raw color "${decl.value}" on "${decl.prop}" — reference a design token CSS var.${hint}`,
            line: decl.line,
            column: decl.column,
          });
        }
      },
    };
  },
};

export default {
  name: 'dtifx',
  version: '1.0.0',
  rules: [noHardcodedColorValues],

  /**
   * Optional lifecycle hook — runs once when the plugin is loaded.
   * Receives the runtime environment for setup logic (e.g. registering
   * token sources, connecting to external systems).
   */
  init(env) {
    void env; // env provides platform capabilities (file I/O, module resolution, etc.)
  },
};
