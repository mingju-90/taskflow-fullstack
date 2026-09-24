import { baseConfig } from './src/eslint/base.mjs'
import { nodeConfig } from './src/eslint/node.mjs'

export default [...baseConfig, nodeConfig]
