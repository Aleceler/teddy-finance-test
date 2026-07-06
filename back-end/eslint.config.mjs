import {
  backendRules,
  ignores,
  sharedTypeScriptConfig,
} from '../eslint.base.mjs';

export default [
  { ignores },
  ...sharedTypeScriptConfig,
  {
    files: ['**/*.ts'],
    rules: backendRules,
  },
];
