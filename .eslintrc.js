module.exports = {
  extends: ['plugin:import/recommended', 'plugin:import/typescript', 'plugin:promise/recommended', 'prettier'],
  ignorePatterns: ['**/dist/**/*.js', '**/*.spec.ts'],
  overrides: [
    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        JQuery: false,
        browser: false,
        node: true,
      },
    },
    {
      files: ['*.ts'],
      globals: {
        JQuery: true,
        browser: true,
        node: false,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'ignore',
          },
        ],
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
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  rules: {
    'import/no-unresolved': 'error',
    'no-else-return': 'error',
    'linebreak-style': ['error', 'unix'],
    indent: ['error', 2],
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],
    'promise/catch-or-return': ['error', { allowFinally: true }],
    quotes: ['error', 'single', { avoidEscape: true }],

    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    semi: ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'import/no-unused-modules': [
      1,
      {
        unusedExports: true,
      },
    ],
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
};
