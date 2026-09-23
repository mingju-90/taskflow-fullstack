import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverEnvPath = path.join(rootDir, 'server', '.env')

if (!existsSync(serverEnvPath)) {
  console.error('未找到 server/.env，请先根据 server/.env.example 创建后端环境配置。')
  process.exit(1)
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const processes = [
  {
    name: 'client',
    child: spawn(pnpmCommand, ['run', 'dev'], {
      cwd: path.join(rootDir, 'client'),
      stdio: 'inherit',
    }),
  },
  {
    name: 'server',
    child: spawn(pnpmCommand, ['run', 'dev'], {
      cwd: path.join(rootDir, 'server'),
      stdio: 'inherit',
    }),
  },
]

let shuttingDown = false

function stopChild({ child }, signal) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }

  try {
    child.kill(signal)
  } catch {
    // 子进程可能已在退出流程中结束，无需重复处理。
  }
}

function shutdown() {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  for (const item of processes) {
    stopChild(item, 'SIGTERM')
  }

  const forceStopTimer = setTimeout(() => {
    for (const item of processes) {
      stopChild(item, 'SIGKILL')
    }
  }, 3000)

  forceStopTimer.unref()
}

for (const item of processes) {
  item.child.once('error', (error) => {
    console.error(`[dev] ${item.name} 启动失败：${error.message}`)
    process.exitCode = 1
    shutdown()
  })

  item.child.once('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    if (code === 0) {
      console.log(`[dev] ${item.name} 已退出，正在停止其他进程。`)
    } else {
      console.error(
        `[dev] ${item.name} 异常退出，退出码：${code ?? 'unknown'}，信号：${signal ?? 'none'}`,
      )
    }

    process.exitCode = code ?? 1
    shutdown()
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
process.once('exit', () => {
  for (const item of processes) {
    stopChild(item, 'SIGKILL')
  }
})

console.log('TaskFlow 前端和后端正在启动。按 Ctrl+C 停止。')
