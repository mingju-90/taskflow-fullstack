import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]
