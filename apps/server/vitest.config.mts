import { baseVitestConfig } from '@taskflow/config/vitest/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ...baseVitestConfig,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'test-secret-with-at-least-16-characters',
      UPLOAD_DIR: './uploads/test',
      CLIENT_ORIGIN: 'http://localhost:5173',
    },
  },
})
