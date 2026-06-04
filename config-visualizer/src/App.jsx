import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ConfigTree from './components/ConfigTree'
import Visualization from './components/Visualization'
import { parseEnv } from './parsers/envParser'
import { parseDockerCompose } from './parsers/dockerComposeParser'
import { parseNginx } from './parsers/nginxParser'

const SAMPLE_ENV = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD=secret123

# Redis
REDIS_URL=redis://localhost:6379

# App Settings
APP_PORT=3000
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=abc123xyz

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@myapp.com`

const SAMPLE_DOCKER = `version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

  api:
    image: node:18-alpine
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"`

const SAMPLE_NGINX = `http {
    upstream backend {
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
    }

    server {
        listen 80;
        server_name example.com;
        root /var/www/html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /static {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        location ~* \\.(jpg|jpeg|png|gif|ico)$ {
            expires 1y;
        }
    }
}`

function App() {
  const [parsedData, setParsedData] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileLoad = (file) => {
    setFileName(file.name)
    let parsed
    switch (file.type) {
      case 'env':
        parsed = parseEnv(file.content)
        break
      case 'docker-compose':
        parsed = parseDockerCompose(file.content)
        break
      case 'nginx':
        parsed = parseNginx(file.content)
        break
      default:
        if (file.content.trim().startsWith('{')) {
          try {
            parsed = { type: 'json', data: JSON.parse(file.content) }
          } catch {
            parsed = { type: 'text', content: file.content }
          }
        } else if (file.content.includes('server {') || file.content.includes('http {')) {
          parsed = parseNginx(file.content)
        } else if (file.content.includes('services:')) {
          parsed = parseDockerCompose(file.content)
        } else if (file.content.includes('=')) {
          parsed = parseEnv(file.content)
        } else {
          parsed = { type: 'text', content: file.content }
        }
    }
    setParsedData(parsed)
    setSelectedNode(null)
  }

  const loadSample = (type) => {
    const samples = {
      env: { name: '.env', content: SAMPLE_ENV, type: 'env' },
      docker: { name: 'docker-compose.yml', content: SAMPLE_DOCKER, type: 'docker-compose' },
      nginx: { name: 'nginx.conf', content: SAMPLE_NGINX, type: 'nginx' },
    }
    handleFileLoad(samples[type])
  }

  return (
    <div className="app">
      <header>
        <h1>⚙️ Config Visualizer</h1>
        <p>Upload config files and see them visualized as interactive diagrams</p>
      </header>

      <FileUploader onFileLoad={handleFileLoad} />

      <div className="sample-buttons">
        <span style={{ color: '#64748b', alignSelf: 'center' }}>Try samples:</span>
        <button onClick={() => loadSample('env')}>📄 .env</button>
        <button onClick={() => loadSample('docker')}>🐳 docker-compose.yml</button>
        <button onClick={() => loadSample('nginx')}>🌐 nginx.conf</button>
      </div>

      {parsedData && (
        <>
          <div className="file-info">
            <span className="name">📁 {fileName}</span>
            <span className="type">{parsedData.type}</span>
          </div>

          <div className="visualization-area">
            <div className="panel">
              <h2>🌳 Structure</h2>
              <ConfigTree data={parsedData} onSelect={setSelectedNode} />
            </div>
            <div className="panel">
              <h2>📊 Diagram</h2>
              <Visualization data={parsedData} />
            </div>
          </div>

          {selectedNode && (
            <div className="detail-panel">
              <h3>Details</h3>
              {Object.entries(selectedNode).map(([key, value]) => {
                if (key === 'children' || key === 'entries') return null
                return (
                  <div key={key} className="detail-row">
                    <span className="label">{key}</span>
                    <span className="value">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {!parsedData && (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="icon">📊</div>
          <p>Upload a config file or try a sample to get started</p>
        </div>
      )}
    </div>
  )
}

export default App
