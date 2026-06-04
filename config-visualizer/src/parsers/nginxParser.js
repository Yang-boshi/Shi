export function parseNginx(content) {
  const result = { type: 'nginx', blocks: [], directives: [] }

  try {
    const tokens = tokenize(content)
    result.blocks = parseTokens(tokens)
    result.directives = extractDirectives(result.blocks)
  } catch (e) {
    result.error = e.message
  }

  return result
}

function tokenize(content) {
  const tokens = []
  let current = ''
  let inQuote = false
  let quoteChar = ''

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]

    if (ch === '#' && !inQuote) {
      if (current.trim()) tokens.push({ type: 'word', value: current.trim() })
      current = ''
      let comment = ''
      while (i < content.length && content[i] !== '\n') {
        comment += content[i]
        i++
      }
      tokens.push({ type: 'comment', value: comment.trim() })
      continue
    }

    if ((ch === '"' || ch === "'") && !inQuote) {
      inQuote = true
      quoteChar = ch
      continue
    }

    if (ch === quoteChar && inQuote) {
      inQuote = false
      quoteChar = ''
      continue
    }

    if (inQuote) {
      current += ch
      continue
    }

    if (ch === '{') {
      if (current.trim()) tokens.push({ type: 'word', value: current.trim() })
      current = ''
      tokens.push({ type: 'lbrace' })
      continue
    }

    if (ch === '}') {
      if (current.trim()) tokens.push({ type: 'word', value: current.trim() })
      current = ''
      tokens.push({ type: 'rbrace' })
      continue
    }

    if (ch === ';') {
      if (current.trim()) tokens.push({ type: 'word', value: current.trim() })
      current = ''
      tokens.push({ type: 'semicolon' })
      continue
    }

    if (ch === ' ' || ch === '\t' || ch === '\n') {
      if (current.trim()) tokens.push({ type: 'word', value: current.trim() })
      current = ''
      continue
    }

    current += ch
  }

  if (current.trim()) tokens.push({ type: 'word', value: current.trim() })

  return tokens
}

function parseTokens(tokens) {
  const blocks = []
  let i = 0

  while (i < tokens.length) {
    if (tokens[i].type === 'comment') {
      blocks.push({ type: 'comment', value: tokens[i].value })
      i++
    } else if (tokens[i].type === 'word') {
      const directive = tokens[i].value
      i++

      if (i < tokens.length && tokens[i].type === 'lbrace') {
        i++
        const children = []
        let depth = 1
        const start = i
        while (i < tokens.length && depth > 0) {
          if (tokens[i].type === 'lbrace') depth++
          if (tokens[i].type === 'rbrace') depth--
          if (depth > 0) {
            children.push(tokens[i])
          }
          i++
        }
        blocks.push({
          type: 'block',
          directive,
          children: parseTokens(children),
        })
      } else {
        const params = []
        while (i < tokens.length && tokens[i].type === 'word') {
          params.push(tokens[i].value)
          i++
        }
        if (i < tokens.length && tokens[i].type === 'semicolon') i++
        blocks.push({ type: 'directive', directive, params })
      }
    } else {
      i++
    }
  }

  return blocks
}

function extractDirectives(blocks, parent = '') {
  const directives = []
  for (const block of blocks) {
    if (block.type === 'directive') {
      directives.push({
        context: parent,
        directive: block.directive,
        params: block.params,
        display: `${block.directive} ${block.params.join(' ')}`,
      })
    } else if (block.type === 'block') {
      directives.push({
        context: parent,
        directive: block.directive,
        isBlock: true,
        childCount: block.children?.length || 0,
      })
      if (block.children) {
        directives.push(
          ...extractDirectives(block.children, block.directive)
        )
      }
    }
  }
  return directives
}
