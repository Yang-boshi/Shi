export function generateReadme(data) {
  const {
    projectName = 'My Project',
    description = '',
    badges = {},
    features = [],
    techStack = [],
    prerequisites = [],
    installSteps = [],
    usage = '',
    apiEndpoints = [],
    envVars = [],
    license = 'MIT',
    author = '',
    githubUrl = '',
    screenshot = '',
    acknowledgements = [],
  } = data

  let md = ''

  // Badges
  const badgeList = []
  if (badges.license) badgeList.push(`![License](https://img.shields.io/badge/license-${license}-blue.svg)`)
  if (badges.version) badgeList.push(`![Version](https://img.shields.io/badge/version-1.0.0-green.svg)`)
  if (badges.build) badgeList.push(`![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)`)
  if (badges.downloads) badgeList.push(`![Downloads](https://img.shields.io/badge/downloads-1k-orange.svg)`)
  if (badges.stars) badgeList.push(`![Stars](https://img.shields.io/github/stars/${author}/${projectName.toLowerCase().replace(/\s+/g, '-')}?style=social)`)

  if (badgeList.length > 0) {
    md += badgeList.join(' ') + '\n\n'
  }

  // Title and description
  md += `# ${projectName}\n\n`
  if (description) {
    md += `${description}\n\n`
  }

  // Screenshot
  if (screenshot) {
    md += `![Screenshot](${screenshot})\n\n`
  }

  // Features
  if (features.length > 0) {
    md += `## ✨ Features\n\n`
    features.forEach(f => {
      md += `- ${f}\n`
    })
    md += '\n'
  }

  // Tech Stack
  if (techStack.length > 0) {
    md += `## 🛠️ Tech Stack\n\n`
    md += `| Technology | Purpose |\n`
    md += `|-----------|----------|\n`
    techStack.forEach(tech => {
      md += `| ${tech} | - |\n`
    })
    md += '\n'
  }

  // Prerequisites
  if (prerequisites.length > 0) {
    md += `## 📋 Prerequisites\n\n`
    prerequisites.forEach(p => {
      md += `- ${p}\n`
    })
    md += '\n'
  }

  // Installation
  if (installSteps.length > 0) {
    md += `## 🚀 Installation\n\n`
    md += '```bash\n'
    installSteps.forEach(step => {
      md += `${step}\n`
    })
    md += '```\n\n'
  }

  // Environment Variables
  if (envVars.length > 0) {
    md += `## 🔧 Environment Variables\n\n`
    md += 'Create a `.env` file in the root directory:\n\n'
    md += '```env\n'
    envVars.forEach(v => {
      md += `${v}\n`
    })
    md += '```\n\n'
  }

  // Usage
  if (usage) {
    md += `## 📖 Usage\n\n`
    md += '```bash\n'
    md += usage + '\n'
    md += '```\n\n'
  }

  // API Endpoints
  if (apiEndpoints.length > 0) {
    md += `## 📡 API Endpoints\n\n`
    md += `| Method | Endpoint | Description |\n`
    md += `|--------|----------|-------------|\n`
    apiEndpoints.forEach(ep => {
      md += `| ${ep.method || 'GET'} | \`${ep.path || '/'}\` | ${ep.description || ''} |\n`
    })
    md += '\n'
  }

  // Contributing
  md += `## 🤝 Contributing\n\n`
  md += `Contributions are welcome! Please feel free to submit a Pull Request.\n\n`
  md += `1. Fork the project\n`
  md += `2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n`
  md += `3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n`
  md += `4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n`
  md += `5. Open a Pull Request\n\n`

  // License
  md += `## 📄 License\n\n`
  md += `This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.\n\n`

  // Acknowledgements
  if (acknowledgements.length > 0) {
    md += `## 🙏 Acknowledgements\n\n`
    acknowledgements.forEach(a => {
      md += `- ${a}\n`
    })
    md += '\n'
  }

  // Author
  if (author) {
    md += `## 👤 Author\n\n`
    md += `**${author}**\n`
    if (githubUrl) {
      md += `- GitHub: [@${author}](${githubUrl})\n`
    }
    md += '\n'
  }

  return md
}

export const projectTemplates = {
  node: {
    name: 'Node.js Project',
    prerequisites: ['Node.js >= 18', 'npm or yarn'],
    installSteps: ['git clone https://github.com/user/repo.git', 'cd repo', 'npm install', 'npm run dev'],
    usage: 'npm start',
    envVars: ['PORT=3000', 'DATABASE_URL=postgresql://...', 'API_KEY=your_api_key'],
  },
  python: {
    name: 'Python Project',
    prerequisites: ['Python >= 3.9', 'pip'],
    installSteps: ['git clone https://github.com/user/repo.git', 'cd repo', 'python -m venv venv', 'source venv/bin/activate', 'pip install -r requirements.txt', 'python app.py'],
    usage: 'python app.py',
    envVars: ['FLASK_ENV=development', 'DATABASE_URL=sqlite:///db.sqlite3', 'SECRET_KEY=your_secret'],
  },
  react: {
    name: 'React App',
    prerequisites: ['Node.js >= 18', 'npm'],
    installSteps: ['git clone https://github.com/user/repo.git', 'cd repo', 'npm install', 'npm run dev'],
    usage: 'npm run dev',
    envVars: ['VITE_API_URL=http://localhost:3000'],
  },
  docker: {
    name: 'Docker Project',
    prerequisites: ['Docker', 'Docker Compose'],
    installSteps: ['git clone https://github.com/user/repo.git', 'cd repo', 'docker-compose up -d'],
    usage: 'docker-compose up',
    envVars: ['POSTGRES_PASSWORD=secret', 'REDIS_URL=redis://redis:6379'],
  },
}
