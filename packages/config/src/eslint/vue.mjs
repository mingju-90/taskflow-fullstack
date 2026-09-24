import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export const vueConfig = [
  ...pluginVue.configs['flat/recommended'],
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
