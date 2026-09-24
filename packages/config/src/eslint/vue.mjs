import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

/** Vue 单文件组件配置，按扁平配置格式启用模板推荐规则和 TypeScript 解析器。 */
export const vueConfig = [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    rules: {
      // 纯排版交给 Prettier，避免与 ESLint 的 Vue 格式规则重复报告。
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
]
