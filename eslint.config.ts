// eslint.config.js
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Base ESLint config
    ignores: ['node_modules', 'dist', 'build', 'coverage', './*.ts', 'frontend/*.js', 'backend/*.js'],
  },
  // TypeScript parser and recommended configs
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // Import plugin configuration
  {
    files: ['backend/**/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir: './backend',
        project: ['./tsconfig.json'], // Include both tsconfig.json files
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  {
    files: ['frontend/**/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir: './frontend',
        project: ['./tsconfig.json'], // Include both tsconfig.json files
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  {
    files: ['shared/**/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir: './shared',
        project: ['./tsconfig.json'], // Include both tsconfig.json files
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  {
    files: ['/**/*.{ts,tsx}'],
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  // Prettier config (must be last)
  prettierConfig
);