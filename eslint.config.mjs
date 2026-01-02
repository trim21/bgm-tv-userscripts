import babelParser from '@babel/eslint-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import prettier from 'eslint-config-prettier';

export default [
  {
    name: 'ignores',
    ignores: ['**/dist/**/*.js', '**/*.spec.ts', '**/.yarn/**', 'eslint.config.mjs'],
  },
  {
    name: 'javascript',
    files: ['**/*.{js,cjs,mjs}'],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-import-assertions'],
        },
      },
      globals: {
        JQuery: false,
        browser: false,
        node: true,
      },
    },
    settings: {
      ...(importPlugin.configs.recommended?.settings ?? {}),
    },
    rules: {
      ...(importPlugin.configs.recommended?.rules ?? {}),
      ...(promisePlugin.configs.recommended?.rules ?? {}),
    },
  },
  {
    name: 'typescript',
    files: ['**/*.ts'],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        JQuery: true,
        browser: true,
        node: false,
      },
    },
    settings: {
      ...(importPlugin.configs.recommended?.settings ?? {}),
      ...(importPlugin.configs.typescript?.settings ?? {}),
    },
    rules: {
      ...(importPlugin.configs.recommended?.rules ?? {}),
      ...(importPlugin.configs.typescript?.rules ?? {}),
      ...(promisePlugin.configs.recommended?.rules ?? {}),
      ...(tsPlugin.configs.recommended?.rules ?? {}),
      ...(tsPlugin.configs['recommended-requiring-type-checking']?.rules ?? {}),
      ...prettier.rules,
      'promise/always-return': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowAny: true }],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  {
    name: 'shared-rules',
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
    },
    rules: {
      'import/no-unresolved': 'error',
      'no-else-return': 'error',
      'array-element-newline': ['error', 'consistent'],
      'array-bracket-newline': ['error', 'consistent'],
      'promise/catch-or-return': ['error', { allowFinally: true }],
      'promise/always-return': 'off',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      semi: ['error', 'always'],
      'comma-dangle': 'off',
      'no-unused-vars': 'off',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', ['index', 'sibling', 'parent'], 'internal', 'object'],
        },
      ],
    },
  },
  prettier,
];
