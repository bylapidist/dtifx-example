/**
 * Custom design-lint plugin for the DTIFx example stack.
 *
 * Demonstrates the plugin API from the design-lint v8 docs:
 * - RuleModule with onCSSDeclaration hook
 * - ctx.getDtifTokens() to access the kernel's canonical DTIF token graph
 * - ctx.getTokenPath() to derive dot-delimited token paths
 * - ctx.report() to surface violations
 *
 * Register in designlint.config.js:
 *   plugins: ['./ops/plugins/dtifx-rules.js']
 */

/**
 * dtifx/no-hardcoded-color-values
 *
 * Checks that color CSS properties don't contain raw hex/rgb literals when
 * registered DTIF color tokens are available. Complements design-token/colors
 * by surfacing a project-specific message naming the expected token path.
 */
const noHardcodedColorValues = {
  name: 'dtifx/no-hardcoded-color-values',
  meta: {
    description:
      'Require color properties to use a registered design token CSS variable instead of a raw color literal.',
  },
  create(ctx) {
    const colorTokens = ctx.getDtifTokens('color');
    const tokenPaths = colorTokens.map((t) => ctx.getTokenPath(t));

    return {
      onCSSDeclaration(decl) {
        const colorProps = ['color', 'background-color', 'border-color', 'fill', 'stroke'];
        if (!colorProps.includes(decl.prop)) return;
        if (decl.value.startsWith('var(')) return;

        const isRawColor =
          /^#[0-9a-fA-F]{3,8}$/.test(decl.value) ||
          /^rgba?\(/.test(decl.value) ||
          /^hsl/.test(decl.value);

        if (isRawColor) {
          const hint =
            tokenPaths.length > 0
              ? ` Available token paths: ${tokenPaths.slice(0, 3).join(', ')}${tokenPaths.length > 3 ? '…' : ''}`
              : '';
          ctx.report({
            message: `dtifx: raw color "${decl.value}" on "${decl.prop}" — reference a design token CSS var instead.${hint}`,
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
};
