import { useState, useEffect, useRef } from 'react'

export default function Visualization({ data }) {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    if (!data) return
    const generated = generateNodes(data)
    setNodes(generated)
  }, [data])

  const generateNodes = (data) => {
    const nodes = []

    if (data.type === 'env') {
      nodes.push({ id: 'root', label: 'ENV', x: 300, y: 30, type: 'root' })
      const groups = {}
      data.entries.forEach(entry => {
        if (entry.type !== 'variable') return
        const group = entry.key.split('_')[0]
        if (!groups[group]) groups[group] = []
        groups[group].push(entry)
      })

      let y = 80
      Object.entries(groups).forEach(([group, entries], gi) => {
        const x = 50 + (gi % 4) * 140
        nodes.push({ id: `group-${group}`, label: group, x, y, type: 'group', parent: 'root' })
        entries.slice(0, 3).forEach((entry, ei) => {
          nodes.push({
            id: `var-${entry.key}`,
            label: entry.key,
            x: x + (ei - 1) * 30,
            y: y + 60 + ei * 35,
            type: 'variable',
            parent: `group-${group}`,
            value: entry.value,
          })
        })
        if (entries.length > 3) {
          nodes.push({
            id: `more-${group}`,
            label: `+${entries.length - 3} more`,
            x, y: y + 60 + 3 * 35,
            type: 'more',
            parent: `group-${group}`,
          })
        }
      })
    }

    if (data.type === 'docker-compose') {
      nodes.push({ id: 'root', label: 'Docker Compose', x: 250, y: 30, type: 'root' })
      data.services.forEach((service, i) => {
        const angle = (i / data.services.length) * Math.PI * 2 - Math.PI / 2
        const cx = 250 + Math.cos(angle) * 150
        const cy = 150 + Math.sin(angle) * 100
        nodes.push({ id: `svc-${service.name}`, label: service.name, x: cx, y: cy, type: 'service', parent: 'root' })

        service.ports.slice(0, 2).forEach((port, pi) => {
          nodes.push({
            id: `port-${service.name}-${pi}`,
            label: port,
            x: cx + (pi - 0.5) * 80,
            y: cy + 60,
            type: 'port',
            parent: `svc-${service.name}`,
          })
        })

        service.depends_on.slice(0, 2).forEach((dep, di) => {
          nodes.push({
            id: `dep-${service.name}-${di}`,
            label: dep,
            x: cx + (di - 0.5) * 80,
            y: cy - 50,
            type: 'dependency',
            parent: `svc-${service.name}`,
          })
        })
      })
    }

    if (data.type === 'nginx') {
      nodes.push({ id: 'root', label: 'Nginx', x: 300, y: 30, type: 'root' })
      const servers = data.blocks.filter(b => b.type === 'block' && b.directive === 'server')
      servers.forEach((server, i) => {
        const sx = 100 + i * 250
        nodes.push({ id: `server-${i}`, label: `Server ${i + 1}`, x: sx, y: 100, type: 'service', parent: 'root' })

        const locations = server.children?.filter(b => b.type === 'block' && b.directive === 'location') || []
        locations.slice(0, 3).forEach((loc, li) => {
          const path = loc.params?.[0] || '/'
          nodes.push({
            id: `loc-${i}-${li}`,
            label: path,
            x: sx + (li - 1) * 100,
            y: 180,
            type: 'port',
            parent: `server-${i}`,
          })
        })

        const listen = server.children?.find(b => b.type === 'directive' && b.directive === 'listen')
        if (listen) {
          nodes.push({
            id: `listen-${i}`,
            label: `:${listen.params[0]}`,
            x: sx + 80,
            y: 100,
            type: 'port',
            parent: `server-${i}`,
          })
        }
      })
    }

    return nodes
  }

  const getLineStyle = (parentType, childType) => {
    if (parentType === 'root') return { color: '#38bdf8', width: 2 }
    if (childType === 'port') return { color: '#fbbf24', width: 1.5, dash: true }
    if (childType === 'dependency') return { color: '#f472b6', width: 1.5, dash: true }
    return { color: '#334155', width: 1 }
  }

  const getNodeStyle = (type) => {
    switch (type) {
      case 'root': return { bg: '#1e3a5f', border: '#f472b6', text: '#fff', size: 60 }
      case 'service': return { bg: '#1a3a2a', border: '#34d399', text: '#34d399', size: 50 }
      case 'group': return { bg: '#2d1a4a', border: '#a78bfa', text: '#a78bfa', size: 45 }
      case 'port': return { bg: '#3a2a1a', border: '#fbbf24', text: '#fbbf24', size: 40 }
      case 'variable': return { bg: '#1e293b', border: '#38bdf8', text: '#e2e8f0', size: 35 }
      case 'dependency': return { bg: '#3a1a2a', border: '#f472b6', text: '#f472b6', size: 35 }
      default: return { bg: '#1e293b', border: '#475569', text: '#94a3b8', size: 30 }
    }
  }

  if (!data) {
    return (
      <div className="graph-container">
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>Upload a config file to see the visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className="graph-container" style={{ minHeight: '400px', position: 'relative' }}>
      <svg width="100%" height="400" style={{ position: 'absolute', top: 0, left: 0 }}>
        {nodes.map(node => {
          if (!node.parent) return null
          const parent = nodes.find(n => n.id === node.parent)
          if (!parent) return null
          const style = getLineStyle(parent.type, node.type)
          return (
            <line
              key={`line-${node.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={node.x}
              y2={node.y}
              stroke={style.color}
              strokeWidth={style.width}
              strokeDasharray={style.dash ? '5,5' : 'none'}
            />
          )
        })}
      </svg>
      {nodes.map(node => {
        const style = getNodeStyle(node.type)
        return (
          <div
            key={node.id}
            className={`graph-node ${node.type}`}
            style={{
              left: node.x - style.size / 2,
              top: node.y - 15,
              minWidth: style.size,
              background: style.bg,
              borderColor: style.border,
              color: style.text,
              textAlign: 'center',
            }}
            title={node.value || node.label}
          >
            {node.label}
          </div>
        )
      })}
    </div>
  )
}
