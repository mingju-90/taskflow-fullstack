// ai-commit-check-ignore-file：本文件包含校验规则本身，跳过文本规则自检。
// cspell:ignore ACMR retrun recieve seperate occured sucess erorr adress widht heigth
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prettier from 'prettier'

const spellCheckExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.vue',
  '.yaml',
  '.yml',
])
const codeExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.vue',
])
const failures = []
const warnings = []

function runGit(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  })
}

function getStagedFiles() {
  const output = runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
  return output
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean)
}

function addLineFindings(file, content, patterns) {
  const lines = content.split(/\r?\n/)

  for (const [pattern, message, level] of patterns) {
    lines.forEach((line, index) => {
      pattern.lastIndex = 0
      if (!pattern.test(line)) {
        return
      }
      const finding = `${file}:${index + 1} ${message}`
      if (level === 'warning') {
        warnings.push(finding)
      } else {
        failures.push(finding)
      }
    })
  }
}

function inspectText(file, content) {
  const extension = path.extname(file)
  const isCode = codeExtensions.has(extension)
  const isTest = /(?:^|\/)(?:tests?|e2e)\//.test(file) || /\.(?:test|spec)\.[^.]+$/.test(file)
  const isCliScript = file.startsWith('scripts/')

  addLineFindings(file, content, [
    [/^(?:<{7}|={7}(?:$|\s)|>{7})/m, '发现未解决的合并冲突标记。', 'error'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, '发现私钥内容。', 'error'],
    [
      /(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*['"][A-Za-z0-9_./+=-]{12,}['"]/i,
      '发现疑似硬编码凭据。',
      'error',
    ],
  ])

  if (isCode) {
    addLineFindings(file, content, [
      [/\bdebugger\b/, '发现调试器语句 debugger。', 'error'],
      [/\b(?:describe|it|test)\.only\s*\(/, '发现测试仅执行标记 .only。', 'error'],
      [/\b(?:describe|it|test)\.skip\s*\(/, '发现被跳过的测试，请确认是否有意。', 'warning'],
      [/(?:^|\s)(?:TODO|FIXME)(?:\s|:|$)/, '发现未关联需求或问题的 TODO/FIXME。', 'warning'],
    ])
  }

  const typoPatterns = [
    ['登陆', '登录'],
    ['帐号', '账号'],
    ['retrun', 'return'],
    ['recieve', 'receive'],
    ['seperate', 'separate'],
    ['occured', 'occurred'],
    ['sucess', 'success'],
    ['erorr', 'error'],
    ['adress', 'address'],
    ['widht', 'width'],
    ['heigth', 'height'],
  ]

  for (const [typo, replacement] of typoPatterns) {
    if (content.includes(typo)) {
      failures.push(`${file} 发现疑似拼写错误“${typo}”，应使用“${replacement}”。`)
    }
  }

  const inappropriatePatterns = [
    /傻逼|妈的|操你|脑残|垃圾代码/i,
    /\b(?:fuck|shit|bitch|asshole)\b/i,
  ]

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(content)) {
      failures.push(`${file} 发现明显不合适的表达，请改写为专业文案。`)
    }
  }

  if (!isCode || isTest) {
    return
  }

  if (!isCliScript) {
    addLineFindings(file, content, [
      [/\bconsole\.log\s*\(/, '生产代码中存在 console.log，请改用日志模块或删除。', 'error'],
    ])
  }
}

async function inspectFormatting(file, stagedContent) {
  const fileInfo = await prettier.getFileInfo(file, {
    ignorePath: '.prettierignore',
  })

  if (fileInfo.ignored || !fileInfo.inferredParser) {
    return
  }

  const options = await prettier.resolveConfig(file)
  const formatted = await prettier.check(stagedContent, {
    ...options,
    filepath: file,
  })

  if (!formatted) {
    failures.push(`${file} 未通过 Prettier，请运行 npm run format 后重新暂存。`)
  }
}

function inspectSpelling(files) {
  if (files.length === 0) {
    return
  }

  const executable = path.join(
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'cspell.cmd' : 'cspell',
  )
  const result = spawnSync(executable, ['--no-progress', '--no-summary', ...files], {
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
    failures.push(`暂存文件未通过拼写检查：\n${output}`)
  }
}

const stagedFiles = getStagedFiles()

if (stagedFiles.length === 0) {
  console.log('暂存区没有可校验文件。')
  process.exit(0)
}

const diffCheck = spawnSync('git', ['diff', '--cached', '--check'], {
  encoding: 'utf8',
})

if (diffCheck.status !== 0) {
  failures.push(`暂存区存在空白字符问题：\n${diffCheck.stdout ?? ''}${diffCheck.stderr ?? ''}`)
}

const spellCheckFiles = []

for (const file of stagedFiles) {
  if (!existsSync(file)) {
    continue
  }

  const stagedBuffer = execFileSync('git', ['show', `:${file}`])
  const worktreeBuffer = readFileSync(file)

  if (!stagedBuffer.equals(worktreeBuffer)) {
    failures.push(`${file} 的暂存内容与工作区不一致，请重新执行 git add。`)
    continue
  }

  if (stagedBuffer.includes(0)) {
    continue
  }

  const content = stagedBuffer.toString('utf8')
  const extension = path.extname(file)

  if (!content.includes('ai-commit-check-ignore-file')) {
    inspectText(file, content)
  }
  await inspectFormatting(file, content)

  if (spellCheckExtensions.has(extension) && !file.startsWith('docs/')) {
    spellCheckFiles.push(file)
  }
}

inspectSpelling(spellCheckFiles)

if (warnings.length > 0) {
  console.warn('暂存区检查警告：')
  for (const warning of warnings) {
    console.warn(`- ${warning}`)
  }
}

if (failures.length > 0) {
  console.error('暂存区检查失败：')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`暂存区检查通过，共检查 ${stagedFiles.length} 个文件。`)
