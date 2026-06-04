import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { generateReadme, projectTemplates } from './templates/readmeTemplate'

function App() {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState('node')

  const [form, setForm] = useState({
    projectName: 'My Awesome Project',
    description: 'A brief description of what this project does and why it exists.',
    author: 'yourusername',
    githubUrl: 'https://github.com/yourusername/my-awesome-project',
    license: 'MIT',
    screenshot: '',
    usage: '',
    features: ['Fast and lightweight', 'Easy to use', 'Well documented'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    prerequisites: [],
    installSteps: [],
    envVars: [],
    apiEndpoints: [],
    acknowledgements: ['Inspired by open source community'],
    badges: { license: true, version: true, build: false, downloads: false, stars: false },
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleBadge = (badge) => {
    setForm(prev => ({
      ...prev,
      badges: { ...prev.badges, [badge]: !prev.badges[badge] }
    }))
  }

  const addListItem = (field, value) => {
    if (!value.trim()) return
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
  }

  const removeListItem = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const loadTemplate = (key) => {
    setActiveTemplate(key)
    const tmpl = projectTemplates[key]
    if (tmpl) {
      setForm(prev => ({
        ...prev,
        prerequisites: tmpl.prerequisites,
        installSteps: tmpl.installSteps,
        usage: tmpl.usage,
        envVars: tmpl.envVars,
      }))
    }
  }

  const readme = generateReadme(form)

  const handleCopy = () => {
    navigator.clipboard.writeText(readme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([readme], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header>
        <h1>📝 README Generator</h1>
        <p>Create beautiful GitHub READMEs with a form-based editor</p>
      </header>

      <div className="main-content">
        <div className="panel">
          <h2>📋 Project Details</h2>

          <div className="template-selector">
            {Object.entries(projectTemplates).map(([key, tmpl]) => (
              <button
                key={key}
                className={`template-btn ${activeTemplate === key ? 'active' : ''}`}
                onClick={() => loadTemplate(key)}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Project Name</label>
              <input
                value={form.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Author / GitHub Username</label>
                <input
                  value={form.author}
                  onChange={(e) => updateField('author', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>License</label>
                <select
                  value={form.license}
                  onChange={(e) => updateField('license', e.target.value)}
                >
                  <option>MIT</option>
                  <option>Apache 2.0</option>
                  <option>GPL 3.0</option>
                  <option>BSD 3-Clause</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Screenshot URL (optional)</label>
              <input
                value={form.screenshot}
                onChange={(e) => updateField('screenshot', e.target.value)}
                placeholder="https://example.com/screenshot.png"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>🏷️ Badges</h3>
            <div className="badge-config">
              {Object.entries(form.badges).map(([key, active]) => (
                <button
                  key={key}
                  className={`badge-toggle ${active ? 'active' : ''}`}
                  onClick={() => toggleBadge(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <ListInput
            label="✨ Features"
            items={form.features}
            onAdd={(v) => addListItem('features', v)}
            onRemove={(i) => removeListItem('features', i)}
            placeholder="Add a feature..."
          />

          <ListInput
            label="🛠️ Tech Stack"
            items={form.techStack}
            onAdd={(v) => addListItem('techStack', v)}
            onRemove={(i) => removeListItem('techStack', i)}
            placeholder="Add technology..."
          />

          <ListInput
            label="📋 Prerequisites"
            items={form.prerequisites}
            onAdd={(v) => addListItem('prerequisites', v)}
            onRemove={(i) => removeListItem('prerequisites', i)}
            placeholder="Add prerequisite..."
          />

          <ListInput
            label="🚀 Install Commands"
            items={form.installSteps}
            onAdd={(v) => addListItem('installSteps', v)}
            onRemove={(i) => removeListItem('installSteps', i)}
            placeholder="Add command..."
          />

          <ListInput
            label="🔧 Environment Variables"
            items={form.envVars}
            onAdd={(v) => addListItem('envVars', v)}
            onRemove={(i) => removeListItem('envVars', i)}
            placeholder="KEY=value"
          />

          <div className="form-group">
            <label>📖 Usage Command</label>
            <input
              value={form.usage}
              onChange={(e) => updateField('usage', e.target.value)}
              placeholder="npm start"
            />
          </div>
        </div>

        <div className="panel">
          <div className="output-header">
            <h2>📄 Generated README</h2>
            <div>
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button className="download-btn" onClick={handleDownload}>
                ⬇️ Download
              </button>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button
              className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
              onClick={() => setActiveTab('raw')}
            >
              Raw Markdown
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="markdown-preview">
              <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
          ) : (
            <div className="raw-code">{readme}</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListInput({ label, items, onAdd, onRemove, placeholder }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    onAdd(value)
    setValue('')
  }

  return (
    <div className="form-section">
      <h3>{label}</h3>
      <div className="list-input">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>+</button>
      </div>
      <div className="tag-list">
        {items.map((item, i) => (
          <span key={i} className="tag">
            {item}
            <button onClick={() => onRemove(i)}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default App
