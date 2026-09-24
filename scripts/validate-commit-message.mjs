// ai-commit-check-ignore-file：本文件包含提交信息规则本身，跳过文本规则自检。
import { readFileSync } from 'node:fs'

// pnpm 会将显式分隔符 `--` 一并转发给脚本，这里同时兼容 npm 和 pnpm 的参数形式。
const messageFile = process.argv.slice(2).find((argument) => argument !== '--')

const rawMessage = messageFile ? readFileSync(messageFile, 'utf8') : readFileSync(0, 'utf8')
const lines = rawMessage
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
const subject = lines[0] ?? ''

if (!subject) {
  console.error('提交信息不能为空。')
  process.exit(1)
}

if (
  /^(Merge|Revert)\b/.test(subject) ||
  subject.startsWith('fixup!') ||
  subject.startsWith('squash!')
) {
  process.exit(0)
}

const subjectPattern =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert): [\p{Script=Han}][\s\S]*$/u
const genericSubjects = new Set(['update', 'misc', 'wip', 'changes', '修改', '更新'])
const typoReplacements = new Map([
  ['登陆', '登录'],
  ['帐号', '账号'],
])
const errors = []

if (!subjectPattern.test(subject)) {
  errors.push('提交摘要必须使用“英文类型前缀 + 冒号 + 中文说明”，例如“feat: 增加任务筛选”。')
}

if (subject.length > 72) {
  errors.push(`提交摘要过长，当前 ${subject.length} 个字符，最多 72 个字符。`)
}

if (genericSubjects.has(subject.toLocaleLowerCase())) {
  errors.push('提交摘要过于宽泛，请说明具体行为。')
}

for (const [typo, replacement] of typoReplacements) {
  if (subject.includes(typo)) {
    errors.push(`提交摘要存在疑似错别字“${typo}”，应使用“${replacement}”。`)
  }
}

if (errors.length > 0) {
  console.error('提交信息校验失败：')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`提交信息校验通过：${subject}`)
