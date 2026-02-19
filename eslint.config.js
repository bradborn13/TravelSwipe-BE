        import tsPlugin from '@typescript-eslint/eslint-plugin';
        import tsParser from '@typescript-eslint/parser';
        import prettierPlugin from 'eslint-plugin-prettier';

        export default [
          {
            files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
              project: './tsconfig.eslint.json',
              tsconfigRootDir: new URL('.', import.meta.url).pathname,
              sourceType: 'module',
              ecmaVersion: 2021, // move it here
            },
          },
              ignores: ["node_modules/**", "dist/**", "build/**"],
            plugins: {
              '@typescript-eslint': tsPlugin,
              prettier: prettierPlugin,
            },
            rules: {
              // TypeScript
              '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
              '@typescript-eslint/explicit-function-return-type': 'off',

              // Prettier
              'prettier/prettier': ['error', { endOfLine: 'auto', tabWidth: 2, useTabs: false }],
            },
          },
        ];