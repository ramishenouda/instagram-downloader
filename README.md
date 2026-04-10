# � VideoSnap - Instagram Video Downloader

<div align="center">

**Free, Open-Source, Self-Hosted Instagram Video Downloader**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/instagram-downloader?style=social)](https://github.com/yourusername/instagram-downloader)
[![Docker](https://img.shields.io/badge/Docker-Available-blue?logo=docker)](https://www.docker.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- ✅ **Download Reels, Posts & Videos** — Support for Instagram reels, regular videos, and album videos
- 🔒 **Privacy First** — Self-hosted, no tracking, no ads, no third-party services
- 🚀 **Fast & Lightweight** — Powered by [Cobalt](https://cobalt.tools) API
- 🐳 **Docker Ready** — One-command deployment with Docker Compose
- ⚡ **Simple UI** — Clean, modern interface for easy use
- 📦 **No Dependencies** — Minimal setup required
- 🌐 **Web-Based** — No installation needed, works in any browser

---

## 🎯 What It Does

Paste an Instagram URL → get instant video download. That's it!

```
✨ Instagram Reels       → Downloaded
✨ Video Posts          → Downloaded
✨ Album Videos         → Downloaded (first video)
❌ Private Accounts     → Not supported
❌ Stories              → Limited support
```

---

## 🚀 Quick Start

### With Docker Compose (Recommended)

Everything runs with a single command:

```bash
# Clone the repository
git clone https://github.com/yourusername/instagram-downloader.git
cd instagram-downloader

# Start all services
docker-compose up -d

# That's it! Access at http://localhost
```

**Services that start:**
- 🎨 React Frontend on port `80`
- 🔌 Node.js Proxy API on port `8000`
- 📥 Cobalt Video Downloader (internal)

### Local Development (Without Docker)

```bash
# 1. Start Cobalt (in one terminal)
git clone https://github.com/imputnet/cobalt.git
cd cobalt/api
npm install && npm start
# Runs on http://localhost:8000

# 2. Start Backend Proxy (in another terminal)
cd backend
npm install
COBALT_URL=http://localhost:8000 npm start
# Runs on http://localhost:8000

# 3. Start Frontend (in third terminal)
npm run dev
# Open http://localhost:5173
```

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│  Beautiful UI (Vite)    │
│  Port: 80 (prod)        │
└────────────┬────────────┘
             │ API Requests
             ▼
┌─────────────────────────┐
│  Node.js Proxy Server   │
│  (Express)              │
│  Port: 8000             │
└────────────┬────────────┘
             │ Forward
             ▼
┌─────────────────────────┐
│  Cobalt API (v11.7+)    │
│  Instagram Downloader   │
│  Port: 5000 (internal)  │
└─────────────────────────┘
```

**Why this architecture?**
- ✅ Frontend can't access Instagram directly (CORS blocked)
- ✅ Proxy server handles CORS headers + routes requests
- ✅ Cobalt API running locally = no external API rate limits
- ✅ Self-contained, completely private, no tracking

---

## 📦 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Vite 5 |
| **Backend Proxy** | Node.js + Express |
| **Video Engine** | Cobalt v11.7+ |
| **Deployment** | Docker + Docker Compose |
| **Styling** | CSS3 (no dependencies) |

---

## 🌍 Deployment

### Deploy to Your Server

**Requirements:**
- Docker & Docker Compose installed
- Port 80 (frontend) and 8000 (backend) accessible
- ~500MB disk space

**Steps:**

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Clone the project
git clone https://github.com/yourusername/instagram-downloader.git
cd instagram-downloader

# 3. Update environment (optional)
nano .env.local
# VITE_API_URL=https://your-domain.com:8000/api/download

# 4. Start everything
docker-compose up -d

# 5. Access it
# http://your-server-ip or https://your-domain.com
```

**Monitor services:**
```bash
docker-compose ps              # Show status
docker-compose logs -f backend # View backend logs
docker-compose logs -f cobalt  # View Cobalt logs
```

**Stop/Restart:**
```bash
docker-compose stop            # Stop all
docker-compose restart backend # Restart one service
docker-compose down            # Remove all
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Frontend API URL
VITE_API_URL=http://localhost:8000/api/download

# For production, use your domain:
# VITE_API_URL=https://your-domain.com:8000/api/download
```

### Docker Compose Customization

Edit `docker-compose.yml` to adjust:
- **Ports**: Change `80:3000` to another port
- **Cobalt settings**: Add environment variables
- **Memory/CPU**: Resource limits

---

## 🚨 Limitations & Known Issues

### What Works ✅
- Public Instagram posts, reels, videos
- Album videos (downloads first video)
- Direct MP4 download links
- Up to ~1080p quality

### What Doesn't Work ❌
- **Private accounts** — Instagram requires login
- **Stories** — Limited support
- **Heavy usage** — Instagram may rate-limit after ~100 downloads/hour per IP
- **Age-restricted content** — Requires verification

### Rate Limiting
- Free tier: ~100 downloads/hour per IP (Instagram's limit)
- If rate limited, wait 1-24 hours or use a proxy

---

## 📋 Troubleshooting

### "Post not found or Cobalt service unavailable"
```bash
# Check if Cobalt is running
docker-compose logs cobalt

# Restart it
docker-compose restart cobalt

# Try a different Instagram URL
```

### "Cannot reach backend"
```bash
# Check backend logs
docker-compose logs backend

# Verify it's running on port 8000
docker-compose exec backend curl http://localhost:8000
```

### Frontend shows blank page
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild
docker-compose up -d --build
```

### Rate limited by Instagram
- This is a known limitation of any Instagram downloader
- Wait 1-24 hours before trying again
- Consider using a proxy/VPN if needed frequently

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

**Important:** This tool is for downloading **publicly accessible content only**. Users are responsible for complying with Instagram's Terms of Service and applicable laws in their jurisdiction.

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Frontend (React)
npm run dev      # Start dev server
npm run build    # Build for production

# Backend (Node.js)
cd backend
npm install
npm start        # Start proxy server

# Docker
docker-compose up -d --build  # Full stack
```

### Code Style
- Use 2-space indentation
- Follow existing code patterns
- Test before submitting PRs

---

## 🙏 Acknowledgments

- **[Cobalt](https://github.com/imputnet/cobalt)** — The amazing Instagram downloader engine (39.5k⭐)
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool
- **[Express](https://expressjs.com/)** — Minimal web framework
- All contributors and users who've helped improve this project

---

## ⚖️ Legal Notice

This project is provided as-is for educational and personal use. Users are responsible for ensuring their use complies with:
- Instagram's [Terms of Service](https://help.instagram.com/581066165555160)
- Local copyright laws
- Data protection regulations

The maintainers are not responsible for misuse of this tool.

---

## 📞 Support

### Getting Help
- 📖 Check the [DEPLOY.md](DEPLOY.md) guide for detailed setup instructions
- 🐛 Found a bug? [Open an issue](https://github.com/yourusername/instagram-downloader/issues)
- 💡 Have an idea? [Start a discussion](https://github.com/yourusername/instagram-downloader/discussions)

### Useful Links
- [Cobalt Documentation](https://github.com/imputnet/cobalt)
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://react.dev/)

---

<div align="center">

made with ❤️ for the open-source community

[⭐ Star us on GitHub](https://github.com/yourusername/instagram-downloader) | [🐛 Report Bug](https://github.com/yourusername/instagram-downloader/issues) | [💬 Discussions](https://github.com/yourusername/instagram-downloader/discussions)

</div>
