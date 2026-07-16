import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'off', // JSX elements (e.g. <div>) aren't "undefined" globals; avoids false positives without the react plugin
    },
  },
];