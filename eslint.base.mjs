import nx from '@nx/eslint-plugin';
import nxTypeScript from '@nx/eslint-plugin/typescript';

export const ignores = [
  '**/dist/**',
  '**/out-tsc/**',
  '**/coverage/**',
  '**/test-output/**',
  '**/node_modules/**',
];

export const sharedTypeScriptConfig = [
  ...nx.configs['flat/base'],
  ...nxTypeScript.configs.typescript,
];

export const backendRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-throw-literal': 'error',
  'prefer-const': 'error',
  'no-duplicate-imports': 'error',
};

export const sharedRules = {
  ...backendRules,
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
  ],
};
