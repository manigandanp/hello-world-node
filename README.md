# Hello World Node.js

A simple Hello World Node.js app with Express, Docker, and CI/CD over Tailscale.

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

## CI/CD Pipeline

```
Developer ──▶ GitHub (MR) ──▶ Lint/Test ──▶ Build Docker ──▶ Deploy DEV
                                                                    │
                  Merge to Main ──▶ Lint/Test ──▶ Build ──▶ Deploy PRD
```

### Architecture: Zero-Trust Deployment with Tailscale

```
GitHub Actions                    Tailscale Network                Oracle Instances
   Runner ────── tag:ci ────────────────────────────────────── tag:dev (100.112.240.54)
   (ephemeral)     │           (WireGuard tunnel)                tag:prd (100.91.103.116)
                     │                                               tag:arm  (100.107.158.102)
                     │
                     └── No SSH keys, no public IPs
                         Tailscale SSH authenticates via ACLs
```

### Environments

| Environment | Branch | Trigger | Tailscale Host | Access |
|-------------|--------|---------|----------------|--------|
| Development | MR/PR | On PR creation/update | `oracle-2.tailf7c768.ts.net:3000` | Via tailnet only |
| Production  | `main` | On merge to main | `oracle-1.tailf7c768.ts.net:3000` | Via tailnet only |

### Secrets (GitHub Actions)

| Secret | Description |
|--------|-------------|
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth Client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth Client Secret |

No SSH keys stored. No host IPs stored. Tailscale SSH handles authentication.

### Tailscale ACLs

```json
{
  "tagOwners": {
    "tag:ci":  ["autogroup:owner"],
    "tag:dev": ["autogroup:owner"],
    "tag:prd": ["autogroup:owner"]
  },
  "acls": [
    {"action": "accept", "src": ["autogroup:owner"], "dst": ["*:*"]},
    {"action": "accept", "src": ["tag:ci"],         "dst": ["tag:dev:22"]},
    {"action": "accept", "src": ["tag:ci"],         "dst": ["tag:prd:22"]}
  ],
  "ssh": [
    {"action": "check",  "src": ["autogroup:member"], "dst": ["autogroup:self"], "users": ["autogroup:nonroot", "root"]},
    {"action": "accept", "src": ["tag:ci"],          "dst": ["tag:dev"],         "users": ["ubuntu"]},
    {"action": "accept", "src": ["tag:ci"],          "dst": ["tag:prd"],         "users": ["ubuntu"]}
  ]
}