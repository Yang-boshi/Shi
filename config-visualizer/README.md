# ⚙️ Config Visualizer

Upload config files (.env, docker-compose.yml, nginx.conf) and see them visualized as interactive diagrams.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Features

- **Drag & Drop** file upload
- **Multi-format support**: .env, docker-compose.yml, nginx.conf, .json, .yaml
- **Interactive tree view** of config structure
- **Visual diagram** showing relationships between config elements
- **Color-coded** by type (services, ports, variables, etc.)
- **Sample files** included for quick testing
- **Responsive design** works on mobile

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Usage

1. Open the app in your browser
2. Drag & drop a config file or click to browse
3. View the parsed structure in the tree panel
4. See the visual diagram in the diagram panel
5. Click on nodes to see details

### Supported Formats

| Format | Description |
|--------|-------------|
| `.env` | Environment variables with grouping |
| `docker-compose.yml` | Services, ports, dependencies |
| `nginx.conf` | Server blocks, locations, directives |
| `.json` | Generic JSON visualization |
| `.yaml` | Generic YAML visualization |

## 🛠️ Tech Stack

- React 18
- Vite
- Custom parsers (no external YAML/JSON libs needed)
- SVG-based diagram rendering

## 📄 License

MIT License
