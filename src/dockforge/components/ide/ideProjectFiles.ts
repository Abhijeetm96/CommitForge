// Enterprise project file contents for the IDE simulator
// Simulates a realistic SaaS microservice Docker project

export interface ProjectFile {
  name: string;
  path: string;
  language: 'dockerfile' | 'yaml' | 'typescript' | 'sql' | 'nginx' | 'env' | 'gitignore' | 'json';
  icon: string;
  editable: boolean;
  content: string;
}

export interface ProjectFolder {
  name: string;
  path: string;
  expanded: boolean;
  children: (ProjectFile | ProjectFolder)[];
}

export type ProjectTreeItem = ProjectFile | ProjectFolder;

export function isFolder(item: ProjectTreeItem): item is ProjectFolder {
  return 'children' in item;
}

export const PROJECT_FILES: Record<string, string> = {
  'Dockerfile': `# ==========================================
# PRODUCTION MULTI-STAGE BUILD
# Stage 1: Build the TypeScript application
# Stage 2: Create minimal production image
# ==========================================

# --- Stage 1: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (layer caching optimization)
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# --- Stage 2: Production ---
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

USER appuser
CMD ["node", "dist/server.js"]`,

  'Dockerfile.dev': `# ==========================================
# DEVELOPMENT DOCKERFILE
# Hot-reloading with ts-node-dev
# ==========================================

FROM node:20-alpine
WORKDIR /app

# Install all dependencies (including devDeps)
COPY package.json package-lock.json ./
RUN npm ci

# Source code will be bind-mounted at runtime
# No COPY of source needed for dev

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000
EXPOSE 9229

# Start with hot-reload and debug port
CMD ["npx", "ts-node-dev", "--respawn", "--inspect=0.0.0.0:9229", "src/server.ts"]`,

  'docker-compose.yml': `# ==========================================
# PRODUCTION COMPOSE STACK
# Acme SaaS Platform — 4-service architecture
# ==========================================

services:
  # --- API Gateway (Nginx reverse proxy) ---
  gateway:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - frontend

  # --- Node.js API Server ---
  api:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://appuser:S3cur3P@ss!@db:5432/acme_prod
      - REDIS_URL=redis://cache:6379
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 15s
      timeout: 5s
      retries: 3
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
    networks:
      - frontend
      - backend

  # --- PostgreSQL Database ---
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: S3cur3P@ss!
      POSTGRES_DB: acme_prod
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d acme_prod"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
    networks:
      - backend

  # --- Redis Cache ---
  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M
    networks:
      - backend

volumes:
  pgdata:
    driver: local
  redis-data:
    driver: local

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true`,

  'docker-compose.dev.yml': `# ==========================================
# DEVELOPMENT COMPOSE OVERRIDE
# Run with: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# ==========================================

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - ./src:/app/src:cached
      - ./package.json:/app/package.json:ro
    ports:
      - "3000:3000"
      - "9229:9229"   # Node.js debugger
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://appuser:devpass@db:5432/acme_dev
      - LOG_LEVEL=debug

  db:
    environment:
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: acme_dev
    ports:
      - "5432:5432"   # Expose for local DB tools

  cache:
    ports:
      - "6379:6379"   # Expose for Redis CLI`,

  '.dockerignore': `node_modules
npm-debug.log
dist
.git
.gitignore
.env
.env.*
*.md
.vscode
.idea
coverage
tests
docker-compose*.yml
Dockerfile*
.dockerignore`,

  '.env': `# ==========================================
# Environment Variables for Production
# NEVER commit real secrets — use Docker Secrets
# ==========================================

NODE_ENV=production
PORT=3000

# Database
POSTGRES_USER=appuser
POSTGRES_PASSWORD=S3cur3P@ss!
POSTGRES_DB=acme_prod
DATABASE_URL=postgres://appuser:S3cur3P@ss!@db:5432/acme_prod

# Redis
REDIS_URL=redis://cache:6379

# Auth
JWT_SECRET=change-me-in-production-use-docker-secrets
JWT_EXPIRES_IN=7d

# Registry
REGISTRY_URL=ghcr.io/acme-corp`,

  'nginx.conf': `# ==========================================
# Nginx Reverse Proxy Configuration
# Routes traffic to the Node.js API
# ==========================================

worker_processes auto;

events {
    worker_connections 1024;
}

http {
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;

    # Upstream API servers
    upstream api_backend {
        server api:3000;
        keepalive 32;
    }

    server {
        listen 80;
        server_name _;

        # Health check endpoint (no rate limiting)
        location /health {
            proxy_pass http://api_backend;
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Default: return 404
        location / {
            return 404 '{"error": "Not Found"}';
            add_header Content-Type application/json;
        }
    }
}`,

  'src/server.ts': `import express from 'express';
import { Pool } from 'pg';
import Redis from 'ioredis';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection Pool ---
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// --- Redis Cache Client ---
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

// Health check (used by Docker HEALTHCHECK)
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'healthy', uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: String(err) });
  }
});

// List users (with Redis caching)
app.get('/api/users', async (req, res) => {
  const cached = await redis.get('users:all');
  if (cached) {
    return res.json({ source: 'cache', data: JSON.parse(cached) });
  }
  const { rows } = await db.query('SELECT id, name, email FROM users LIMIT 100');
  await redis.setex('users:all', 60, JSON.stringify(rows));
  res.json({ source: 'database', data: rows });
});

// Create user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  await redis.del('users:all'); // Invalidate cache
  res.status(201).json(rows[0]);
});

// Graceful shutdown (responds to Docker SIGTERM)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await db.end();
  redis.disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(\`🚀 Acme API running on port \${PORT}\`);
  console.log(\`📊 Health: http://localhost:\${PORT}/health\`);
});`,

  'src/database.ts': `import { Pool } from 'pg';

// Database connection configuration
// Uses environment variables from docker-compose.yml
export const createPool = (): Pool => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: parseInt(process.env.DB_POOL_MAX || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
};

// Migration runner utility
export async function runMigrations(pool: Pool): Promise<void> {
  console.log('Running database migrations...');

  await pool.query(\`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  \`);

  console.log('Migrations complete.');
}`,

  'migrations/001_init.sql': `-- ==========================================
-- Initial Database Schema
-- Runs automatically on first container start
-- via /docker-entrypoint-initdb.d/
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Seed initial data
INSERT INTO users (name, email) VALUES
    ('Alice Engineer', 'alice@acme.io'),
    ('Bob DevOps', 'bob@acme.io'),
    ('Charlie SRE', 'charlie@acme.io');

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id),
    action      VARCHAR(50) NOT NULL,
    details     JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);`,

  'package.json': `{
  "name": "acme-saas-platform",
  "version": "2.4.1",
  "description": "Acme SaaS Platform API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --coverage",
    "lint": "eslint src/",
    "migrate": "node dist/migrations/run.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.12.0",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.9",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "eslint": "^8.56.0"
  }
}`,
};

export const PROJECT_TREE: ProjectTreeItem[] = [
  { name: 'Dockerfile', path: 'Dockerfile', language: 'dockerfile', icon: '🐳', editable: true, content: PROJECT_FILES['Dockerfile'] },
  { name: 'Dockerfile.dev', path: 'Dockerfile.dev', language: 'dockerfile', icon: '🐳', editable: true, content: PROJECT_FILES['Dockerfile.dev'] },
  { name: 'docker-compose.yml', path: 'docker-compose.yml', language: 'yaml', icon: '📦', editable: true, content: PROJECT_FILES['docker-compose.yml'] },
  { name: 'docker-compose.dev.yml', path: 'docker-compose.dev.yml', language: 'yaml', icon: '📦', editable: true, content: PROJECT_FILES['docker-compose.dev.yml'] },
  { name: '.dockerignore', path: '.dockerignore', language: 'gitignore', icon: '🚫', editable: true, content: PROJECT_FILES['.dockerignore'] },
  { name: '.env', path: '.env', language: 'env', icon: '🔑', editable: true, content: PROJECT_FILES['.env'] },
  { name: 'nginx.conf', path: 'nginx.conf', language: 'nginx', icon: '⚙️', editable: false, content: PROJECT_FILES['nginx.conf'] },
  { name: 'package.json', path: 'package.json', language: 'json', icon: '📋', editable: false, content: PROJECT_FILES['package.json'] },
  {
    name: 'src',
    path: 'src/',
    expanded: true,
    children: [
      { name: 'server.ts', path: 'src/server.ts', language: 'typescript', icon: '📝', editable: false, content: PROJECT_FILES['src/server.ts'] },
      { name: 'database.ts', path: 'src/database.ts', language: 'typescript', icon: '📝', editable: false, content: PROJECT_FILES['src/database.ts'] },
    ],
  },
  {
    name: 'migrations',
    path: 'migrations/',
    expanded: false,
    children: [
      { name: '001_init.sql', path: 'migrations/001_init.sql', language: 'sql', icon: '🗄️', editable: false, content: PROJECT_FILES['migrations/001_init.sql'] },
    ],
  },
];
