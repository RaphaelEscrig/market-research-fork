import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import eslintPluginReadableTailwind from 'eslint-plugin-readable-tailwind';
import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('tseslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      prettier: prettier,
      'readable-tailwind': eslintPluginReadableTailwind,
      '@stylistic/ts': stylisticTs,
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'warn',
      'func-style': ['error', 'expression'], // Enforces the use of function expressions (const over function)
      'import/prefer-default-export': 'off', // Disables the prefer-default-export rule
      // Sorts JSX props with specific rules
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: false,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: ['key'],
        },
      ],
      // Reports unused variables, except those prefixed with '_'
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'readable-tailwind/multiline': [
        'error',
        {
          printWidth: 140,
          group: 'newLine',
          preferSingleLine: true,
        },
      ],
      'readable-tailwind/sort-classes': [
        'error',
        {
          order: 'improved',
        },
      ],
    },
  },
];
