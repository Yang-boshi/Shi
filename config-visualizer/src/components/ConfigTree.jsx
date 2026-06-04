export default function ConfigTree({ data, onSelect }) {
  if (!data) return null

  if (data.type === 'env') {
    return <EnvTree data={data} onSelect={onSelect} />
  }
  if (data.type === 'docker-compose') {
    return <DockerTree data={data} onSelect={onSelect} />
  }
  if (data.type === 'nginx') {
    return <NginxTree data={data} onSelect={onSelect} />
  }

  return <GenericTree data={data} onSelect={onSelect} />
}

function EnvTree({ data, onSelect }) {
  const groups = {}
  const ungrouped = []

  data.entries.forEach(entry => {
    if (entry.type === 'comment') return
    const group = entry.key.split('_')[0]
    if (!groups[group]) groups[group] = []
    groups[group].push(entry)
  })

  return (
    <div>
      <div className="file-info">
        <span className="name">📄 Environment File</span>
        <span className="count">{data.entries.filter(e => e.type === 'variable').length} variables</span>
      </div>
      {Object.entries(groups).map(([group, entries]) => (
        <div key={group} style={{ marginBottom: '10px' }}>
          <div style={{ color: '#f472b6', fontWeight: 600, padding: '4px 0', fontSize: '0.9rem' }}>
            📁 {group}
          </div>
          {entries.map((entry, i) => (
            <div
              key={i}
              className="node-item"
              style={{ marginLeft: '15px' }}
              onClick={() => onSelect(entry)}
            >
              <span className="node-key">{entry.key}</span>
              <span className="separator"> = </span>
              <span className="node-value">{entry.value}</span>
              <span className="node-type">{entry.valueType}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function DockerTree({ data, onSelect }) {
  return (
    <div>
      <div className="file-info">
        <span className="name">🐳 Docker Compose</span>
        <span className="count">{data.services.length} services</span>
      </div>
      {data.services.map((service, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div
            className="node-item"
            style={{ borderLeftColor: '#34d399' }}
            onClick={() => onSelect(service)}
          >
            <span className="node-key">🔧 {service.name}</span>
            {service.image && <span className="node-type">{service.image}</span>}
          </div>
          {service.ports.length > 0 && (
            <div style={{ marginLeft: '15px' }}>
              {service.ports.map((port, j) => (
                <div key={j} className="node-item" style={{ borderLeftColor: '#fbbf24' }}>
                  <span className="node-key">🌐 port</span>
                  <span className="node-value">{port}</span>
                </div>
              ))}
            </div>
          )}
          {service.depends_on.length > 0 && (
            <div style={{ marginLeft: '15px' }}>
              {service.depends_on.map((dep, j) => (
                <div key={j} className="node-item" style={{ borderLeftColor: '#f472b6' }}>
                  <span className="node-key">🔗 depends_on</span>
                  <span className="node-value">{dep}</span>
                </div>
              ))}
            </div>
          )}
          {Object.keys(service.environment).length > 0 && (
            <div style={{ marginLeft: '15px' }}>
              {Object.entries(service.environment).map(([k, v], j) => (
                <div key={j} className="node-item" style={{ borderLeftColor: '#a78bfa' }}>
                  <span className="node-key">⚙️ {k}</span>
                  <span className="node-value">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function NginxTree({ data, onSelect }) {
  return (
    <div>
      <div className="file-info">
        <span className="name">🌐 Nginx Config</span>
        <span className="count">{data.directives.length} directives</span>
      </div>
      {data.blocks.map((block, i) => (
        <NginxBlock key={i} block={block} depth={0} onSelect={onSelect} />
      ))}
    </div>
  )
}

function NginxBlock({ block, depth, onSelect }) {
  if (block.type === 'comment') {
    return (
      <div className="tree-node" style={{ paddingLeft: depth * 15 }}>
        <span className="comment">{block.value}</span>
      </div>
    )
  }

  if (block.type === 'directive') {
    return (
      <div
        className="node-item"
        style={{ marginLeft: depth * 15 }}
        onClick={() => onSelect(block)}
      >
        <span className="node-key">{block.directive}</span>
        <span className="node-value">{block.params.join(' ')}</span>
      </div>
    )
  }

  if (block.type === 'block') {
    const colors = { server: '#34d399', location: '#fbbf24', upstream: '#f472b6', http: '#38bdf8' }
    return (
      <div>
        <div
          className="node-item"
          style={{ marginLeft: depth * 15, borderLeftColor: colors[block.directive] || '#38bdf8' }}
          onClick={() => onSelect(block)}
        >
          <span className="node-key">📦 {block.directive}</span>
          {block.children && <span className="node-type">{block.children.length} items</span>}
        </div>
        {block.children && block.children.map((child, i) => (
          <NginxBlock key={i} block={child} depth={depth + 1} onSelect={onSelect} />
        ))}
      </div>
    )
  }

  return null
}

function GenericTree({ data, onSelect }) {
  if (typeof data === 'object') {
    return (
      <div>
        {Object.entries(data).map(([key, value], i) => (
          <div key={i} className="node-item" onClick={() => onSelect({ key, value })}>
            <span className="node-key">{key}</span>
            <span className="separator">: </span>
            <span className="node-value">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return <div className="tree-node">{String(data)}</div>
}
