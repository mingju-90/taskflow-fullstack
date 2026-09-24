import globals from 'globals'

/** Node.js 环境配置，为脚本和服务端文件补充 Node 全局变量。 */
export const nodeConfig = {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
}
