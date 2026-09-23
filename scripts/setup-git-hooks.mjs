import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

if (!existsSync('.git')) {
  console.log('未检测到 Git 仓库，跳过本地钩子配置。')
  process.exit(0)
}

let currentHooksPath = ''

try {
  currentHooksPath = execFileSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
    encoding: 'utf8',
  }).trim()
} catch {
  currentHooksPath = ''
}

if (currentHooksPath && currentHooksPath !== '.githooks') {
  console.warn(
    `当前仓库已配置 core.hooksPath=${currentHooksPath}，为避免覆盖现有配置，本次不修改。`,
  )
  process.exit(0)
}

execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], {
  stdio: 'inherit',
})

console.log('Git 钩子已启用：.githooks')
