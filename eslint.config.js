import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  { ignores: ['**/dist/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
  },
  eslintConfigPrettier,
])
