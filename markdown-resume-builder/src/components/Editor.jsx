import './Editor.css'

function Editor({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="editor-pane">
      <div className="editor-header">
        <span className="editor-label">Markdown</span>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={handleChange}
        placeholder="Write your resume in Markdown..."
        spellCheck={false}
      />
    </div>
  )
}

export default Editor
