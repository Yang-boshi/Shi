# URL Shortener with Analytics

A self-hosted URL shortener built with Python Flask, featuring click analytics, QR code generation, and a REST API.

## Features

- **Custom Slugs** - Create memorable short links or use auto-generated ones
- **Click Analytics** - Track clicks with timestamp, referrer, user-agent, and IP
- **Visual Dashboard** - Charts for clicks over time, browser distribution
- **QR Codes** - Auto-generated QR codes for each shortened URL
- **REST API** - Programmatic access to all features
- **SQLite Database** - Zero configuration, no external database needed
- **Modern UI** - Clean, responsive design

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database (optional - auto-creates on first run)
python init_db.py

# Start the server
python app.py

# Open http://localhost:5000
```

## API Documentation

### Shorten URL

```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "slug": "custom-slug"  // optional
}
```

Response:
```json
{
  "short_url": "http://localhost:5000/abc123",
  "slug": "abc123",
  "original_url": "https://example.com/very-long-url",
  "qr_code": "data:image/png;base64,..."
}
```

### Get Analytics

```http
GET /api/stats/<slug>
```

Response:
```json
{
  "url": { "slug": "abc123", "original_url": "...", "click_count": 42 },
  "total_clicks": 42,
  "clicks_by_day": [{ "date": "2024-01-15", "count": 10 }],
  "top_referrers": [{ "referrer": "https://twitter.com", "count": 15 }],
  "browsers": [{ "browser": "Chrome", "count": 30 }],
  "recent_clicks": [...]
}
```

## Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Main page with URL shortener |
| `/api/shorten` | POST | Create a short URL |
| `/<slug>` | GET | Redirect to original URL |
| `/stats/<slug>` | GET | Analytics dashboard page |
| `/api/stats/<slug>` | GET | JSON analytics data |

## Deployment

### Using systemd (Linux)

Create `/etc/systemd/system/urlshortener.service`:

```ini
[Unit]
Description=URL Shortener
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/07-url-shortener
ExecStart=/usr/bin/python3 app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable urlshortener
sudo systemctl start urlshortener
```

### Using Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]
```

## Tech Stack

- Python 3 / Flask
- SQLite
- QRCode / Pillow
- Vanilla JavaScript
