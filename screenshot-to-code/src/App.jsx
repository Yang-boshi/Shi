import { useState, useRef } from 'react'
import { templates, colorPresets } from './generators/templates'

function App() {
  const [image, setImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('dashboard')
  const [primaryColor, setPrimaryColor] = useState('#38bdf8')
  const [bgColor, setBgColor] = useState('#f8fafc')
  const [description, setDescription] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [activeTab, setActiveTab] = useState('code')
  const [copied, setCopied] = useState(false)
  const [dragover, setDragover] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) readFile(file)
  }

  const readFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = () => {
    const template = templates[selectedTemplate]
    if (!template) return
    const code = template.generate({ primaryColor, bgColor, description })
    setGeneratedCode(code)
    setActiveTab('code')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="app">
      <header>
        <h1>Screenshot to Code</h1>
        <p>Upload a UI screenshot, pick a template style, and generate HTML/CSS code</p>
      </header>

      <div className="main-content">
        <div className="panel">
          <h2>📸 Upload Screenshot</h2>
          <div
            className={`upload-zone ${dragover ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
            onDragLeave={() => setDragover(false)}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && readFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {image ? (
              <img src={image} alt="Screenshot" className="preview-image" />
            ) : (
              <>
                <div className="icon">🖼️</div>
                <p><strong>Drop an image here</strong> or click to browse</p>
              </>
            )}
          </div>

          <h2 style={{ marginTop: '20px' }}>🎨 Choose Template</h2>
          <div className="template-selector">
            {Object.entries(templates).map(([key, tmpl]) => (
              <div
                key={key}
                className={`template-card ${selectedTemplate === key ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(key)}
              >
                <span className="emoji">{tmpl.emoji}</span>
                <span className="name">{tmpl.name}</span>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: '20px' }}>🎯 Colors</h2>
          <div style={{ marginTop: '10px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Primary Color</label>
            <div className="color-options">
              {colorPresets.map((preset) => (
                <div
                  key={preset.name}
                  className={`color-swatch ${primaryColor === preset.primary ? 'selected' : ''}`}
                  style={{ background: preset.primary }}
                  onClick={() => { setPrimaryColor(preset.primary); setBgColor(preset.bg) }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="options-row" style={{ marginTop: '10px' }}>
            <label>Custom color:</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: '40px', height: '32px', padding: '0', border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the UI (optional)..."
            />
          </div>

          <button className="generate-btn" onClick={handleGenerate}>
            ⚡ Generate Code
          </button>
        </div>

        <div className="panel">
          <h2>💻 Output</h2>
          {generatedCode ? (
            <>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'code' ? 'active' : ''}`}
                  onClick={() => setActiveTab('code')}
                >
                  Code
                </button>
                <button
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
              </div>

              {activeTab === 'code' ? (
                <>
                  <div className="code-header">
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>HTML/CSS</span>
                    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div className="code-output">{generatedCode}</div>
                </>
              ) : (
                <iframe
                  className="preview-frame"
                  srcDoc={generatedCode}
                  title="Preview"
                />
              )}
            </>
          ) : (
            <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💻</div>
              <p>Upload a screenshot and click "Generate Code" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
