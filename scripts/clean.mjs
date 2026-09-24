import { rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targets = [
  '.turbo',
  'apps/client/.turbo',
  'apps/client/dist',
  'apps/client/coverage',
  'apps/server/.turbo',
  'apps/server/dist',
  'apps/server/coverage',
  'packages/config/.turbo',
  'packages/contracts/.turbo',
  'packages/contracts/dist',
  'packages/contracts/coverage',
]

for (const target of targets) {
  rmSync(path.join(rootDir, target), {
    force: true,
    recursive: true,
  })
}

console.log(`已清理 ${targets.length} 个构建或缓存目录。`)
