// eslint.config.cjs

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js globals
        $: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Browser globals
        html: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    ignores: ['dist'], // Correct way to use ignore patterns
  },
  ...compat.extends('eslint:recommended'),
  ...compat.extends('@typhonjs-fvtt/eslint-config-foundry.js/0.8.0'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    rules: {
      // Specify any specific ESLint rules.
      'no-unused-vars': 'warn',
      'no-empty': 'warn',
      'eol-last': 'warn',
    },
  },
  {
    files: ['./*.js', './*.cjs', './*.mjs'],
    environment: {
      node: true,
      browser: true,
    },
  },
];
