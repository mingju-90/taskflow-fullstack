import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverEnvPath = path.join(rootDir, 'apps', 'server', '.env')

if (!existsSync(serverEnvPath)) {
  console.error('未找到 apps/server/.env，请先根据 apps/server/.env.example 创建后端环境配置。')
  process.exit(1)
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(pnpmCommand, ['exec', 'turbo', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
})

child.once('error', (error) => {
  console.error(`[dev] Turborepo 启动失败：${error.message}`)
  process.exit(1)
})

child.once('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

process.once('SIGINT', () => child.kill('SIGINT'))
process.once('SIGTERM', () => child.kill('SIGTERM'))
