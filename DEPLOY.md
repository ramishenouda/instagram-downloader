# Instagram Downloader - Deployment & Setup Guide

## Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│  (Vite + React)         │
│  :80 (prod) or :5173    │
└────────────┬────────────┘
             │ HTTP requests
             ▼
┌─────────────────────────┐
│  Node.js Proxy Server   │
│  (Express)              │
│  :8000                  │
└────────────┬────────────┘
             │ Forward to
             ▼
┌─────────────────────────┐
│  Self-Hosted Cobalt     │
│  (Instagram downloader) │
│  :5000 (internal)       │
└─────────────────────────┘
```

**Three-tier architecture:**
1. React frontend (user-facing, static)
2. Node.js proxy (handles API requests, CORS)
3. Cobalt API (handles Instagram communication)

---

## Quick Start (Docker Compose - Local Testing)

**One command to run everything locally:**

```bash
# From project root
docker-compose up -d

# Wait ~30 seconds for all services to start
sleep 30

# Check services are running
docker-compose ps

# Open in browser:
# Frontend: http://localhost
# API: http://localhost:8000/api/download
```

**Test it:**
```bash
# Paste an Instagram Reels URL in the app
# Should download immediately!
```

**View logs:**
```bash
docker-compose logs -f backend    # See proxy requests
docker-compose logs -f cobalt     # See Cobalt API
docker-compose logs -f frontend   # See frontend build
```

**Stop everything:**
```bash
docker-compose down
```

---

## Docker Deployment (Production)

### Option A: Using Docker Compose (Recommended)

```bash
# From project root directory
docker-compose up -d

# Frontend: http://localhost (port 80)
# Backend Proxy: http://localhost:8000
# Cobalt API: accessible only internally
```

**Check status:**
```bash
docker-compose ps
# Shows all three services running
```

**View logs:**
```bash
docker-compose logs -f cobalt    # Cobalt API logs
docker-compose logs -f backend   # Proxy server logs
docker-compose logs -f frontend  # Frontend build logs
```

**Stop services:**
```bash
docker-compose down
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

---

## Deployment on Your Server

### Prerequisites
- Docker & Docker Compose installed on your server
- At least 1GB free disk space for Docker images
- Ports 80 and 8000 accessible (frontend and backend)

### Steps

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Clone or upload your project:**
```bash
git clone <your-repo-url> instagram-downloader
cd instagram-downloader
```

3. **Start with Docker Compose:**
```bash
docker-compose up -d
```

4. **Verify services are running:**
```bash
docker-compose ps
# All three services should show "Up"

curl http://localhost:8000
# Should return: {"status":"ok","message":"..."}

curl http://localhost
# Should load the Instagram Downloader frontend
```

5. **Check Cobalt is connected:**
```bash
docker-compose logs backend | grep "Forwarding requests"
# Should show: "Forwarding requests to Cobalt at: http://cobalt:8000"
```

---

## Configuration

### Environment Variables

**docker-compose.yml:**
```yaml
backend:
  environment:
    - COBALT_URL=http://cobalt:8000  # Internal Docker network address
```

For local testing (outside Docker):
```bash
COBALT_URL=http://localhost:8000 npm start
```

**Production frontend updates:**
If your server uses a domain:
1. Edit `.env.local`
2. Update `VITE_API_URL` to your domain:
   ```env
   VITE_API_URL=https://your-domain.com:8000/api/download
   ```
3. Rebuild frontend: `npm run build`
4. Redeploy: `docker-compose up -d --build`

---

## Troubleshooting

### "Connection refused" / "Cannot reach Cobalt"
```bash
# Check if Cobalt container is running
docker-compose ps cobalt

# View Cobalt logs
docker-compose logs cobalt

# Restart Cobalt
docker-compose restart cobalt
```

### Frontend can't reach backend
```bash
# Check backend logs
docker-compose logs backend

# Verify proxy is listening on 8000
docker-compose exec backend curl http://localhost:8000

# Check VITE_API_URL in frontend
echo $VITE_API_URL
```

### "Post not found" or "Instagram error"
- URL might be invalid or post was deleted
- Private accounts are not supported
- Try a different public post

### "Cobalt service is not running"
```bash
# Make sure Cobalt is up
docker-compose restart cobalt
docker-compose logs cobalt

# Wait 10 seconds for Cobalt to start
sleep 10

# Restart backend to reconnect
docker-compose restart backend
```

### Out of memory
```bash
# Increase Docker memory limit
docker update --memory 2g instagram-cobalt
docker restart instagram-cobalt
```

---

## Limitations & Notes

⚠️ **Important:**
- Only **public** Instagram content can be downloaded
- **Private accounts** are not supported
- This violates Instagram's ToS for commercial use
- For official integration, use Instagram's Graph API

✅ **Supported:**
- Public posts (single videos)
- Reels
- Video albums/carousels (downloads first video)
- Direct MP4 download

❌ **Not supported:**
- Private accounts
- Stories (limited support in Cobalt)
- Photos only (videos needed)

---

## Stopping & Cleanup

```bash
# Stop all services
docker-compose down

# Remove all containers and images
docker-compose down --rmi all

# Clean up unused Docker resources
docker system prune -a
```

---

## Support

If you encounter issues, check:
1. Backend logs: `docker-compose logs backend`
2. Frontend console (browser DevTools)
3. Instagram API status: Some URLs may not be downloadable due to Instagram restrictions
4. Firewall: Ensure ports 80 and 8000 are open

Happy downloading! 🎥
