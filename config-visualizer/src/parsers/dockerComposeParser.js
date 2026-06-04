export function parseDockerCompose(content) {
  const result = { type: 'docker-compose', services: [], networks: [], volumes: [] }

  try {
    const lines = content.split('\n')
    let currentSection = null
    let currentService = null
    let currentIndent = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const indent = line.search(/\S/)

      if (indent === 0 && trimmed.endsWith(':')) {
        const section = trimmed.slice(0, -1).trim()
        if (section === 'services') {
          currentSection = 'services'
        } else if (section === 'networks') {
          currentSection = 'networks'
        } else if (section === 'volumes') {
          currentSection = 'volumes'
        } else {
          currentSection = section
        }
        continue
      }

      if (currentSection === 'services' && indent === 2 && trimmed.endsWith(':')) {
        const name = trimmed.slice(0, -1).trim()
        currentService = {
          name,
          image: '',
          ports: [],
          volumes: [],
          environment: {},
          depends_on: [],
          networks: [],
          command: '',
          restart: '',
        }
        result.services.push(currentService)
        continue
      }

      if (currentService && indent >= 4) {
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex > 0) {
          const key = trimmed.slice(0, colonIndex).trim()
          const value = trimmed.slice(colonIndex + 1).trim()

          if (key === 'image') {
            currentService.image = value
          } else if (key === 'ports' || key === 'volumes' || key === 'depends_on' || key === 'networks') {
            // These are arrays, handled by list items
          } else if (key === 'restart') {
            currentService.restart = value
          } else if (key === 'command') {
            currentService.command = value
          }
        }

        if (trimmed.startsWith('- ')) {
          const item = trimmed.slice(2).trim()
          if (currentService) {
            // Determine which list this belongs to based on previous context
            if (item.includes(':') && (item.includes('/') || /^\d+:\d+$/.test(item) || /^\d+$/.test(item))) {
              currentService.ports.push(item)
            } else if (item.includes(':') && item.includes('/')) {
              currentService.volumes.push(item)
            } else {
              // Could be depends_on, networks, or generic list item
              if (item.includes('=')) {
                const [k, v] = item.split('=')
                currentService.environment[k.trim()] = v.trim()
              } else {
                currentService.depends_on.push(item)
              }
            }
          }
        }

        if (trimmed.includes(':') && !trimmed.startsWith('- ')) {
          const eqIndex = trimmed.indexOf(':')
          const k = trimmed.slice(0, eqIndex).trim()
          const v = trimmed.slice(eqIndex + 1).trim()
          if (v && currentService && k === 'image') {
            currentService.image = v
          }
          if (k === 'environment' || (currentService && !v)) {
            // environment section
          }
        }
      }
    }

    // Simple YAML-like parsing for environment variables
    const envMatches = content.match(/environment:\s*\n((?:\s+-?\s*.+\n?)*)/g)
    if (envMatches) {
      envMatches.forEach(match => {
        const vars = match.match(/-?\s*(\w+)=(.+)/g)
        if (vars && currentService) {
          vars.forEach(v => {
            const [k, val] = v.replace(/^-\s*/, '').split('=')
            currentService.environment[k.trim()] = val.trim()
          })
        }
      })
    }

  } catch (e) {
    result.error = e.message
  }

  return result
}
