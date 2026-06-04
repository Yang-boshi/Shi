import { useState, useRef } from 'react'

export default function FileUploader({ onFileLoad }) {
  const [dragover, setDragover] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const file = e.dataTransfer.files[0]
    if (file) readFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragover(true)
  }

  const handleDragLeave = () => {
    setDragover(false)
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) readFile(file)
  }

  const readFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      onFileLoad({
        name: file.name,
        content: e.target.result,
        type: detectFileType(file.name),
      })
    }
    reader.readAsText(file)
  }

  const detectFileType = (filename) => {
    const ext = filename.toLowerCase()
    if (ext.endsWith('.env') || ext.includes('.env.')) return 'env'
    if (ext.includes('docker-compose') || ext.includes('compose.yml') || ext.includes('compose.yaml')) return 'docker-compose'
    if (ext.includes('nginx') || ext.endsWith('.conf')) return 'nginx'
    if (ext.endsWith('.yml') || ext.endsWith('.yaml')) return 'yaml'
    if (ext.endsWith('.json')) return 'json'
    if (ext.endsWith('.toml')) return 'toml'
    if (ext.endsWith('.ini') || ext.endsWith('.cfg')) return 'ini'
    return 'unknown'
  }

  return (
    <div
      className={`upload-zone ${dragover ? 'dragover' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".env,.yml,.yaml,.conf,.json,.toml,.ini,.cfg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="icon">📁</div>
      <p><strong>Drop a config file here</strong> or click to browse</p>
      <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>
        Supports: .env, docker-compose.yml, nginx.conf, .json, .yaml
      </p>
    </div>
  )
}
