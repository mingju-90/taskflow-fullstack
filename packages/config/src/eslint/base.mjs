import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/** ESLint 通用基础配置，统一忽略构建产物并启用 JavaScript 和 TypeScript 推荐规则。 */
export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]
