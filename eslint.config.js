import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/**', 'package-lock.json'],
  },
  js.configs.recommended,
  {
    files: ['design-lint.config.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
  },
];
