# Hello World Node.js

A simple Hello World Node.js app with Express, Docker, and CI/CD.

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm start

# Run in dev mode (auto-restart)
npm run dev

# Run tests
npm test
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Hello world with environment info |
| GET | `/health` | Health check endpoint |
| GET | `/greet/:name` | Personalized greeting |

## Docker

```bash
# Build
docker build -t hello-world-node .

# Run
docker run -p 3000:3000 hello-world-node

# Run with custom env
docker run -p 3000:3000 -e NODE_ENV=production hello-world-node
```

## Environments

| Environment | Branch | Trigger | Tailscale URL |
|-------------|--------|---------|----------------|
| Development | MR/Pull Request | On MR creation/update | `http://<dev-instance>:3000` |
| Production  | `main` | On merge to main | `http://<prd-instance>:3000` |

## Architecture

```
Developer ──▶ GitHub (MR) ──▶ CI/CD Pipeline ──▶ Docker Build ──▶ Deploy via Tailscale
                  │                                        │
                  ├── Lint + Test ─────────────────────────┤
                  └── Dev Deploy (on MR)                    └── Prd Deploy (on main merge)
```