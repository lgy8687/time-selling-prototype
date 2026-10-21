import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const registry = JSON.parse(readFileSync(join(root, 'ui-registry.json'), 'utf8'))
const generated = `module.exports = ${JSON.stringify(registry, null, 2)}\n`
const files = []
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (entry.name.endsWith('.wxml')) files.push(path)
  }
}
walk(root)
const errors = []
if (readFileSync(join(root, 'utils/ui-registry-data.js'), 'utf8') !== generated) errors.push('utils/ui-registry-data.js 与 ui-registry.json 不一致，请重新生成')
const seenB = new Map()
const seenZ = new Set()
for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const name = relative(root, file)
  for (const tag of source.match(/<(?:(?:"[^"]*")|(?:'[^']*')|[^'">])*>/g) || []) {
    const b = tag.match(/data-b="(B\d+)"/)?.[1]
    const z = tag.match(/data-z="(Z\d+-\d+)"/)?.[1]
    if ((tag.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/).some(name => ['card','hero','banner'].includes(name))) && !b) errors.push(`${name}: 可见功能区缺少 B 编码：${tag.slice(0, 90)}`)
    if (b) {
      if (!registry.states[b]) errors.push(`${name}: ${b} 未登记`)
      if (seenB.has(b) && !registry.states[b]?.repeatable) errors.push(`${name}: ${b} 已在 ${seenB.get(b)} 使用`)
      seenB.set(b, name)
    }
    if (z) {
      if (!registry.controls[z]) errors.push(`${name}: ${z} 未登记`)
      else if (registry.controls[z].file !== name) errors.push(`${name}: ${z} 文件与登记不一致`)
      seenZ.add(z)
    }
    if (/\b(bindtap|bindinput|bindchange|bindconfirm|catchtap)=/.test(tag) && !z) errors.push(`${name}: 交互标签缺少 Z 编码：${tag.slice(0, 90)}`)
  }
  for (const badge of source.matchAll(/<dev-badge\b[^>]*\bcode="(B\d+)"/g)) {
    if (!registry.states[badge[1]]) errors.push(`${name}: 页面展示的 ${badge[1]} 未登记`)
  }
}
for (const [b, state] of Object.entries(registry.states)) {
  if (!seenB.has(b)) errors.push(`${b} 登记后未在界面使用`)
  if (b !== 'B900' && !files.some(file => readFileSync(file, 'utf8').includes(`code="${b}"`))) errors.push(`${b} 缺少可点击复制的编号标签`)
  if (state.template && !registry.templates[state.template]) errors.push(`${b} 的 C 模板不存在`)
}
for (const [z, control] of Object.entries(registry.controls)) {
  if (!seenZ.has(z)) errors.push(`${z} 登记后未在界面使用`)
  if (!registry.states[control.parent] || z.split('-')[0].replace('Z', 'B') !== control.parent) errors.push(`${z} 的父 B 编码错误`)
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
else console.log(`交互编码检查通过：${seenB.size} 个 B，${seenZ.size} 个 Z。`)
