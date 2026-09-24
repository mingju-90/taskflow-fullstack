import globals from 'globals'

export const nodeConfig = {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
}
