export function parseEnv(content) {
  const lines = content.split('\n')
  const result = { type: 'env', entries: [], groups: {} }

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      if (trimmed.startsWith('#')) {
        result.entries.push({
          type: 'comment',
          content: trimmed,
          line: index + 1,
        })
      }
      return
    }

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) return

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    const entry = {
      type: 'variable',
      key,
      value,
      line: index + 1,
      valueType: getValueType(value),
    }

    result.entries.push(entry)

    const group = key.split('_')[0] || 'OTHER'
    if (!result.groups[group]) result.groups[group] = []
    result.groups[group].push(entry)
  })

  return result
}

function getValueType(value) {
  if (value === 'true' || value === 'false') return 'boolean'
  if (/^\d+$/.test(value)) return 'number'
  if (/^https?:\/\//.test(value)) return 'url'
  if (value.includes('@')) return 'email'
  if (/^[A-Z_]+$/.test(value) && value.length < 20) return 'constant'
  return 'string'
}
