import { useState } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import './App.css'

const defaultResume = `# John Doe

**Software Engineer** | San Francisco, CA | john.doe@email.com | (555) 123-4567

---

## Summary

Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable applications and solving complex problems.

---

## Experience

### Senior Software Engineer | Tech Corp
*January 2021 - Present*

- Led development of microservices architecture serving 1M+ daily users
- Mentored junior developers and conducted code reviews
- Reduced API response time by 40% through optimization

### Software Engineer | StartupXYZ
*June 2018 - December 2020*

- Built RESTful APIs using Node.js and Express
- Implemented CI/CD pipelines with GitHub Actions
- Developed React-based dashboard for analytics

---

## Education

### B.S. Computer Science
**University of California, Berkeley** | 2014 - 2018

---

## Skills

- **Languages:** JavaScript, TypeScript, Python, SQL
- **Frontend:** React, Vue.js, HTML5, CSS3, Tailwind
- **Backend:** Node.js, Express, Django, PostgreSQL
- **Tools:** Git, Docker, AWS, Kubernetes

---

## Projects

### [Project Manager App](https://github.com/johndoe/pm-app)
A full-stack project management tool built with React and Node.js

### [Weather Dashboard](https://github.com/johndoe/weather)
Real-time weather application using OpenWeatherMap API
`

function App() {
  const [markdown, setMarkdown] = useState(defaultResume)
  const [theme, setTheme] = useState('light')

  const handlePrint = () => {
    window.print()
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`app ${theme}`}>
      <Toolbar onPrint={handlePrint} theme={theme} onToggleTheme={toggleTheme} />
      <div className="editor-container">
        <Editor value={markdown} onChange={setMarkdown} />
        <Preview markdown={markdown} />
      </div>
    </div>
  )
}

export default App
