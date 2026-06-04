import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './Preview.css'

function Preview({ markdown }) {
  return (
    <div className="preview-pane">
      <div className="preview-header">
        <span className="preview-label">Preview</span>
      </div>
      <div className="preview-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default Preview
