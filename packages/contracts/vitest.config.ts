import { baseVitestConfig } from '@taskflow/config/vitest/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ...baseVitestConfig,
    environment: 'node',
  },
})
