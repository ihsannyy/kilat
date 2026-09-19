import { useState, useEffect } from 'react'

// Professional SVG Icons collection
const SVG = {
  Lightning: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Box: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Code: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Globe: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Server: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  Database: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Clock: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Template: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Eye: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Layers: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Terminal: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  BookOpen: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Search: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 18} height={props.height || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Check: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 16} height={props.height || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Copy: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 16} height={props.height || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Cpu: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  Play: (props: { className?: string; width?: number; height?: number }) => (
    <svg width={props.width || 14} height={props.height || 14} viewBox="0 0 24 24" fill="currentColor" className={props.className}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

// Interactive Code Demo Snippets
const codeDemos = [
  {
    id: 'server',
    title: 'Bun-Style HTTP Server',
    filename: 'server.ts',
    code: `// Kilat v5.0.0 High-Throughput HTTP Engine
Kilat.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") {
      return Response.json({
        status: "operational",
        engine: "Kilat v5.0.0",
        coldStart: "< 2ms",
        memoryRSS: "7.8MB",
        platform: "Android ARM64 / Linux"
      });
    }
    return new Response("⚡ Kilat High-Performance Runtime Running!");
  }
});

console.log("🚀 Server listening on http://localhost:3000");`
  },
  {
    id: 'sqlite',
    title: 'Embedded SQLite DB',
    filename: 'database.ts',
    code: `// Zero-setup embedded SQLite database
const db = sql.open("app.db");

// Run DDL migrations
db.execute(\`
  CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    latency_ms REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
\`);

// Prepared statement insertions
db.execute("INSERT INTO telemetry (event, latency_ms) VALUES (?, ?)", ["cold_start", 1.84]);
db.execute("INSERT INTO telemetry (event, latency_ms) VALUES (?, ?)", ["api_request", 0.42]);

// Query records effortlessly
const records = db.query("SELECT * FROM telemetry ORDER BY id DESC LIMIT 5");
console.log("Database Records:", records);`
  },
  {
    id: 'cache',
    title: 'In-Memory TTL Cache',
    filename: 'cache-ttl.ts',
    code: `// Native key-value caching with expiration
// Set item with 60 seconds Time-To-Live (TTL)
cache.set("user:session_992", {
  userId: "usr_01HJ89",
  role: "admin",
  authTime: Date.now()
}, 60);

// Instant retrieval
const activeSession = cache.get("user:session_992");
log.info("Active Session:", activeSession);

// Check presence without fetching payload
if (cache.has("user:session_992")) {
  log.success("Session valid in memory");
}`
  },
  {
    id: 'cron',
    title: 'Background Scheduler',
    filename: 'scheduler.ts',
    code: `// Native periodic task scheduler backed by Go timers
cron.every("5s", () => {
  log.debug("Heartbeat pulse: runtime healthy");
});

cron.every("1m", () => {
  log.info("Flushing memory buffers to persistent storage...");
});

// Single delayed trigger
cron.after("15s", () => {
  log.success("Async warmup sequence complete");
});`
  },
  {
    id: 'shell',
    title: 'Goroutine Shell ($)',
    filename: 'shell.ts',
    code: `// Asynchronous shell execution via Go goroutines
import { os } from 'kilat/os';

log.info(\`Platform: \${os.platform()} (\${os.arch()})\`);

// Execute bash commands without spawning heavy Node subshells
const gitBranch = await $('git rev-parse --abbrev-ref HEAD');
const kernelInfo = await $('uname -r');

log.success(\`Branch: \${gitBranch.trim()} | Kernel: \${kernelInfo.trim()}\`);`
  },
  {
    id: 'fetch',
    title: 'Async Fetch API',
    filename: 'fetch-api.js',
    code: `// Built-in Fetch API with Promise event loop integration
async function queryGitHub(username) {
  try {
    const res = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const user = await res.json();
    log.info(\`👤 User: \${user.name} (@\${user.login})\`);
    log.info(\`📦 Repos: \${user.public_repos}\`);
  } catch (err) {
    log.error("Fetch request failed:", err.message);
  }
}

await queryGitHub("ihsannyy");`
  }
]

// Simulated Realistic Outputs for the Live In-Browser Demo
const demoOutputs = [
  // 0: server.ts
  [
    { type: 'cmd', text: '$ kilat run server.ts' },
    { type: 'success', text: '⚡ [Kilat] Runtime initialized in 1.84ms (RSS: 7.82MB)' },
    { type: 'info', text: '🚀 Server listening on http://localhost:3000' },
    { type: 'dim', text: '📡 Inbound request: GET /api/health HTTP/1.1' },
    { type: 'success', text: 'HTTP 200 OK -> {"status":"operational","engine":"Kilat v5.0.0","coldStart":"<2ms"} [0.28ms]' }
  ],
  // 1: database.ts
  [
    { type: 'cmd', text: '$ kilat run database.ts' },
    { type: 'success', text: '⚡ [Kilat] SQLite database \'app.db\' opened (WAL mode active)' },
    { type: 'info', text: '✓ Table \'telemetry\' verified and indexed' },
    { type: 'dim', text: '✓ 2 parameterized records inserted in 0.41ms' },
    { type: 'success', text: 'Database Records: [ { id: 1, event: "cold_start", latency_ms: 1.84 }, { id: 2, event: "api_request", latency_ms: 0.42 } ]' }
  ],
  // 2: cache-ttl.ts
  [
    { type: 'cmd', text: '$ kilat run cache-ttl.ts' },
    { type: 'info', text: '[CACHE SET] key: user:session_992 (TTL: 60s)' },
    { type: 'info', text: '[INFO] Active Session: { userId: "usr_01HJ89", role: "admin", authTime: 1773820921000 }' },
    { type: 'success', text: '[SUCCESS] Session valid in memory (lookup latency: 0.03ms)' }
  ],
  // 3: scheduler.ts
  [
    { type: 'cmd', text: '$ kilat run scheduler.ts' },
    { type: 'info', text: '⚡ [Kilat Cron] Scheduler background loop armed' },
    { type: 'warn', text: '[DEBUG] Heartbeat pulse: runtime healthy (interval: 5s)' },
    { type: 'info', text: '[INFO] Periodic buffer flusher registered (interval: 1m)' },
    { type: 'success', text: '[SUCCESS] 15s maintenance routine scheduled' }
  ],
  // 4: shell.ts
  [
    { type: 'cmd', text: '$ kilat run shell.ts' },
    { type: 'info', text: '[INFO] Platform: android (arm64)' },
    { type: 'dim', text: '⚡ [Goroutine Shell] Executing git and kernel checks asynchronously...' },
    { type: 'success', text: '[SUCCESS] Branch: main | Kernel: 5.10.198-android12-9' }
  ],
  // 5: fetch-api.js
  [
    { type: 'cmd', text: '$ kilat run fetch-api.js' },
    { type: 'dim', text: '⚡ [Fetch] GET https://api.github.com/users/ihsannyy' },
    { type: 'info', text: '👤 User: Muhammad Ihsan (@ihsannyy)' },
    { type: 'success', text: '📦 Repos: 24 (Status: 200 OK received in 138ms)' }
  ]
]

// Scaffolding Templates
const scaffoldingTemplates = [
  {
    id: 'vanilla',
    name: 'Vanilla JS',
    tag: 'Zero Overhead',
    desc: 'Pure ES6+ JavaScript. The fastest possible cold start (< 1.5ms) without bundling steps.',
    cmd: 'kilat create vanilla my-app'
  },
  {
    id: 'hono',
    name: 'Hono Web Server',
    tag: 'Recommended',
    desc: 'High-speed REST API server powered by Hono router with typed routes and JSON middleware.',
    cmd: 'kilat create hono my-api'
  },
  {
    id: 'react',
    name: 'React + Vite',
    tag: 'Frontend SPA',
    desc: 'Full React 19 single page application bundled with Vite and preconfigured live preview.',
    cmd: 'kilat create react my-spa'
  },
  {
    id: 'vite',
    name: 'Vite + TypeScript',
    tag: 'Modern Tooling',
    desc: 'Standard Vite vanilla TypeScript project ready for instant bundling and client testing.',
    cmd: 'kilat create vite my-web'
  },
  {
    id: 'api',
    name: 'REST API + SQLite',
    tag: 'Fullstack Backend',
    desc: 'Structured RESTful backend with integrated SQLite database persistence and authentication.',
    cmd: 'kilat create api backend'
  }
]

// Release History
const versions = [
  {
    num: 'v5.0.0',
    date: '16 Sep 2026',
    tag: 'Current Release',
    title: 'Kilat Native Modules (sql, cache, cron, log, events)',
    desc: 'Introduced 15 zero-dependency Go-backed standard modules including embedded SQLite (sql), in-memory TTL caching (cache), periodic scheduler (cron), structured colored logging (log), and pub/sub events. Full Termux bionic libc optimization.',
    latest: true,
  },
  {
    num: 'v4.2.0',
    date: '12 Sep 2026',
    tag: 'Network Stack',
    title: 'HTTP Engine & WebSockets',
    desc: 'EventEmitter integration, Bun-compatible Kilat.serve(), raw TCP sockets, and native WebSocket client support.',
    latest: false,
  },
  {
    num: 'v4.1.0',
    date: '12 Sep 2026',
    tag: 'Scaffolding',
    title: 'Template Scaffolding Engine',
    desc: 'kilat create generator supporting vanilla, react, hono, vite, and api templates with instant zero-install launch.',
    latest: false,
  },
  {
    num: 'v4.0.0',
    date: '12 Sep 2026',
    tag: 'Core System',
    title: 'Node Compatibility Layer',
    desc: 'Complete fs, os, path, crypto, child_process, buffer, stream, and timers standard modules.',
    latest: false,
  },
  {
    num: 'v3.1.0',
    date: '13 Jul 2026',
    tag: 'Tooling',
    title: 'Global Package Cache & Bundler',
    desc: 'Introduced ~/.kilat/packages/ centralized cache and kilat build bundling powered by in-memory esbuild.',
    latest: false,
  },
  {
    num: 'v2.1.0',
    date: '11 Jul 2026',
    tag: 'Feature',
    title: 'Goroutine Shell Operator ($)',
    desc: 'Direct async shell command execution powered by Go concurrency with zero subprocess overhead.',
    latest: false,
  },
  {
    num: 'v1.0.0',
    date: '20 Jun 2026',
    tag: 'Initial Release',
    title: 'Engine Initialization',
    desc: 'First public release with embedded Goja ECMAScript runtime for Termux Android environments.',
    latest: false,
  },
]

// Feature Grid Items
const features = [
  {
    icon: <SVG.Lightning width={24} height={24} />,
    title: 'Sub-2ms Cold Starts',
    desc: 'Instant startup without heavy V8 JIT warmup. Perfect for CLI utilities, automation scripts, and serverless edge compute.'
  },
  {
    icon: <SVG.Cpu width={24} height={24} />,
    title: '8MB Memory Footprint',
    desc: 'Idles at less than 8MB of RAM (4x lighter than Node.js). Runs effortlessly on low-spec Android devices and 512MB VPS.'
  },
  {
    icon: <SVG.Box width={24} height={24} />,
    title: 'Zero-Duplication Global Cache',
    desc: 'Packages are stored once in ~/.kilat/packages/. 10 different projects share the same cache without copying gigabytes of files.'
  },
  {
    icon: <SVG.Code width={24} height={24} />,
    title: 'Native TypeScript & TSX',
    desc: 'Direct execution of .ts, .tsx, .js, and .jsx files out-of-the-box. No ts-node, no tsconfig, and no build step required.'
  },
  {
    icon: <SVG.Database width={24} height={24} />,
    title: 'Embedded SQLite (sql)',
    desc: 'Native SQLite driver included directly inside the binary. Execute queries, prepared statements, and transactions without npm packages.'
  },
  {
    icon: <SVG.Server width={24} height={24} />,
    title: 'Bun-Style HTTP Server',
    desc: 'Kilat.serve() delivers high-throughput request handling backed by Go’s battle-tested net/http implementation.'
  },
  {
    icon: <SVG.Clock width={24} height={24} />,
    title: 'TTL Cache & Cron Scheduler',
    desc: 'In-memory key-value cache with automatic TTL expiration and cron scheduling built straight into the standard library.'
  },
  {
    icon: <SVG.Terminal width={24} height={24} />,
    title: 'Goroutine Shell ($)',
    desc: 'Run shell commands asynchronously via $(\'cmd\') with stdout streaming and zero subprocess overhead.'
  },
  {
    icon: <SVG.Layers width={24} height={24} />,
    title: 'Complete Tooling Suite',
    desc: 'Includes kilat build for bundling & minifying, kilat create for scaffolding, live watch mode, and an interactive REPL.'
  }
]

// Complete Documentation Hub Items (All 15 Native Modules + CLI + APIs)
const docsItems = [
  {
    id: 'intro',
    cat: 'Getting Started',
    title: 'Overview & Philosophy',
    tag: 'Core Concept',
    desc: 'Kilat is a standalone JavaScript and TypeScript runtime engineered in Go for Termux, Android, and lightweight Linux environments. It eliminates heavy V8 engine memory usage and node_modules disk duplication.',
    code: `// Execute any TypeScript or JavaScript file instantly
$ kilat run app.ts

// Run with auto-reloading file watcher
$ kilat run server.ts --watch

// Display runtime diagnostics
$ kilat info`
  },
  {
    id: 'install',
    cat: 'Getting Started',
    title: 'Installation Guide',
    tag: 'Setup',
    desc: 'Install Kilat using the automated shell script on Termux, Linux, and macOS, or compile the single binary from source.',
    code: `# One-line automated install
curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash

# Build from source using Go 1.21+
git clone https://github.com/ihsannyy/kilat.git
cd kilat
go build -o kilat ./cmd/kilat
cp kilat $PREFIX/bin/`
  },
  {
    id: 'cli-run',
    cat: 'CLI Tooling',
    title: 'kilat run [file] [--watch]',
    tag: 'Execution',
    desc: 'Runs JavaScript (.js), TypeScript (.ts), JSX, and TSX files. Use --watch or -w to enable hot reload on file changes.',
    code: `$ kilat run index.ts
$ kilat run src/server.ts --watch
$ kilat start  # Runs 'start' script in package.json`
  },
  {
    id: 'cli-create',
    cat: 'CLI Tooling',
    title: 'kilat create [template] [name]',
    tag: 'Scaffolding',
    desc: 'Scaffolds new projects from official templates: vanilla, react, hono, vite, or api.',
    code: `$ kilat create hono my-api-service
$ cd my-api-service
$ kilat run src/index.js`
  },
  {
    id: 'cli-add',
    cat: 'CLI Tooling',
    title: 'kilat add <package>',
    tag: 'Package Cache',
    desc: 'Installs npm packages directly into the shared global package cache (~/.kilat/packages/), preventing disk waste.',
    code: `$ kilat add lodash-es
$ kilat add hono
$ kilat remove lodash-es`
  },
  {
    id: 'cli-build',
    cat: 'CLI Tooling',
    title: 'kilat build <input> <output>',
    tag: 'Bundler',
    desc: 'Bundles and minifies TypeScript and JavaScript modules into a single production distribution file.',
    code: `$ kilat build src/index.ts dist/bundle.js`
  },
  {
    id: 'cli-repl',
    cat: 'CLI Tooling',
    title: 'kilat repl',
    tag: 'Interactive',
    desc: 'Opens an interactive JavaScript/TypeScript evaluation console with access to all built-in standard modules.',
    code: `$ kilat repl
kilat> const os = require('os');
kilat> os.platform();
'android'`
  },
  {
    id: 'mod-sql',
    cat: 'Native Modules',
    title: 'sql — SQLite Database',
    tag: 'Database',
    desc: 'Embedded SQLite driver with connection pooling, parameterized statements, and automatic table creation.',
    code: `const db = sql.open("database.db");

// Execute DDL / Write
db.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, title TEXT)");
db.execute("INSERT INTO items (title) VALUES (?)", ["Task One"]);

// Query records
const items = db.query("SELECT * FROM items");
console.log(items);
db.close();`
  },
  {
    id: 'mod-cache',
    cat: 'Native Modules',
    title: 'cache — In-Memory TTL Cache',
    tag: 'Caching',
    desc: 'High-speed in-memory key-value cache with configurable expiration in seconds.',
    code: `// Store with 300s TTL (5 minutes)
cache.set("auth_token", "jwt_token_payload", 300);

const token = cache.get("auth_token");
const exists = cache.has("auth_token"); // true
cache.delete("auth_token");`
  },
  {
    id: 'mod-cron',
    cat: 'Native Modules',
    title: 'cron — Task Scheduler',
    tag: 'Scheduler',
    desc: 'Native task scheduler using Go timers. Supports recurring interval execution and one-off delayed tasks.',
    code: `// Run callback every 10 seconds
const timerId = cron.every("10s", () => {
  log.info("10-second sync routine executed");
});

// Run callback once after 30 seconds
cron.after("30s", () => {
  log.warn("Delayed clean-up executed");
});

// Cancel active task
cron.stop(timerId);`
  },
  {
    id: 'mod-log',
    cat: 'Native Modules',
    title: 'log — Colored Structured Logger',
    tag: 'Logging',
    desc: 'Rich colored terminal logging with level tagging: info, warn, error, debug, and success.',
    code: `log.info("Server started on port 3000");
log.success("Database connection verified");
log.warn("High memory threshold warning");
log.error("Fatal error during socket handshake:", err);
log.debug("Debug telemetry payload:", { cpu: 12 });`
  },
  {
    id: 'mod-events',
    cat: 'Native Modules',
    title: 'events — Pub/Sub Event Emitter',
    tag: 'Pub/Sub',
    desc: 'Lightweight EventEmitter implementation supporting on, once, off, and emit patterns.',
    code: `events.on("user:login", (user) => {
  log.info(\`User logged in: \${user.name}\`);
});

events.once("system:ready", () => {
  log.success("Initialization routine concluded");
});

events.emit("user:login", { name: "Ihsan" });`
  },
  {
    id: 'mod-fs',
    cat: 'Native Modules',
    title: 'fs — File System I/O',
    tag: 'File I/O',
    desc: 'Comprehensive file system read/write methods supporting both synchronous and asynchronous modes.',
    code: `const fs = require('fs');

// Synchronous operations
fs.writeFileSync('config.json', JSON.stringify({ port: 3000 }));
const data = fs.readFileSync('config.json', 'utf-8');

// Directory exploration
const files = fs.readdirSync('.');
const exists = fs.existsSync('config.json');`
  },
  {
    id: 'mod-os',
    cat: 'Native Modules',
    title: 'os — Operating System Diagnostics',
    tag: 'System Info',
    desc: 'Access kernel and hardware telemetry directly without calling external bash scripts.',
    code: `const os = require('os');

console.log("Platform:", os.platform()); // 'linux', 'android', 'darwin'
console.log("Architecture:", os.arch()); // 'arm64', 'amd64'
console.log("CPUs:", os.cpus().length);
console.log("Free Memory:", Math.round(os.freemem() / 1024 / 1024) + "MB");
console.log("Home Directory:", os.homedir());`
  },
  {
    id: 'mod-path',
    cat: 'Native Modules',
    title: 'path — Cross-Platform Path Handling',
    tag: 'Path Resolution',
    desc: 'Standard path resolution, joining, and normalization routines across POSIX and Windows.',
    code: `const path = require('path');

const target = path.join(process.cwd(), 'src', 'index.ts');
console.log("Normalized:", target);
console.log("Extension:", path.extname(target)); // '.ts'
console.log("Directory:", path.dirname(target));`
  },
  {
    id: 'mod-crypto',
    cat: 'Native Modules',
    title: 'crypto — Cryptography & Hashing',
    tag: 'Cryptography',
    desc: 'Cryptographically secure random bytes, MD5/SHA256 digests, and UUID generation.',
    code: `const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('password123').digest('hex');
const uuid = crypto.uuid();
const randBytes = crypto.randomBytes(16).toString('hex');`
  },
  {
    id: 'mod-child_process',
    cat: 'Native Modules',
    title: 'child_process — Subprocess Execution',
    tag: 'Processes',
    desc: 'Spawn and execute external processes synchronously and asynchronously.',
    code: `const { execSync } = require('child_process');

const output = execSync('uname -a', { encoding: 'utf-8' });
console.log("Kernel:", output.trim());`
  },
  {
    id: 'mod-websocket',
    cat: 'Native Modules',
    title: 'websocket — Real-Time Client',
    tag: 'Networking',
    desc: 'Full WebSocket client implementation for bi-directional live communication.',
    code: `const ws = new WebSocket('wss://echo.websocket.events');

ws.on('open', () => {
  log.success("Connected to WebSocket");
  ws.send("Ping from Kilat");
});

ws.on('message', (msg) => {
  log.info("Received:", msg);
});`
  },
  {
    id: 'api-serve',
    cat: 'Global Runtime APIs',
    title: 'Kilat.serve({ port, fetch })',
    tag: 'HTTP Engine',
    desc: 'Bun-compatible high-performance HTTP web server backed by Go concurrency.',
    code: `Kilat.serve({
  port: 8080,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/json") {
      return Response.json({ status: "ok", time: Date.now() });
    }
    return new Response("⚡ Hello from Kilat Server!");
  }
});`
  },
  {
    id: 'api-shell',
    cat: 'Global Runtime APIs',
    title: '$("<command>") — Async Shell',
    tag: 'Shell Helper',
    desc: 'Global template and function operator for executing bash commands asynchronously with Go goroutines.',
    code: `// Execute shell command asynchronously
const uptime = await $('uptime');
console.log("System Uptime:", uptime.trim());

const status = await $('git status -s');
console.log("Git Changes:", status);`
  },
  {
    id: 'api-fetch',
    cat: 'Global Runtime APIs',
    title: 'fetch(url, options)',
    tag: 'Web Standards',
    desc: 'Web-standard Promise-based HTTP client supporting JSON, text, streaming, and custom headers.',
    code: `const res = await fetch('https://api.github.com/zen');
const motto = await res.text();
console.log("Zen Motto:", motto);`
  }
]

export default function App() {
  // Page Routing State: 'home' | 'docs' | 'benchmarks' | 'changelog'
  const [currentPage, setCurrentPage] = useState<'home' | 'docs' | 'benchmarks' | 'changelog'>('home')
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [installerTab, setInstallerTab] = useState<'termux' | 'linux' | 'source' | 'windows'>('termux')
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCodeTab, setActiveCodeTab] = useState(0)
  const [isRunningDemo, setIsRunningDemo] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(docsItems[0])
  const [searchDocQuery, setSearchDocQuery] = useState('')
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchModalQuery, setSearchModalQuery] = useState('')

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'docs') setCurrentPage('docs')
      else if (hash === 'benchmarks') setCurrentPage('benchmarks')
      else if (hash === 'changelog') setCurrentPage('changelog')
      else setCurrentPage('home')
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const installCommands = {
    termux: 'curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash',
    linux: 'curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash',
    source: 'git clone https://github.com/ihsannyy/kilat.git && cd kilat && go build -o kilat ./cmd/kilat',
    windows: 'powershell -c "irm https://github.com/ihsannyy/kilat/releases/latest/download/kilat-windows-amd64.exe -OutFile kilat.exe"'
  }

  const copyCurrentInstall = () => {
    navigator.clipboard.writeText(installCommands[installerTab])
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const copyTemplateCmd = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedTemplateId(id)
    setTimeout(() => setCopiedTemplateId(null), 2000)
  }

  const runCodeSimulator = () => {
    setIsRunningDemo(true)
    setShowConsole(true)
    setTimeout(() => {
      setIsRunningDemo(false)
    }, 120)
  }

  const navigateTo = (page: 'home' | 'docs' | 'benchmarks' | 'changelog') => {
    setCurrentPage(page)
    window.location.hash = page === 'home' ? 'overview' : page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }

  const filteredDocs = docsItems.filter(item => 
    item.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    item.cat.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchDocQuery.toLowerCase())
  )

  const modalSearchResults = docsItems.filter(item =>
    item.title.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
    item.cat.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchModalQuery.toLowerCase())
  )

  return (
    <div className="site">
      {/* GLOBAL TOP NAVIGATION */}
      <header className="nav">
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#overview" onClick={(e) => { e.preventDefault(); navigateTo('home') }} className="nav-brand">
              <div className="brand-icon-wrapper">
                <img src="/kilat.png" alt="Kilat Logo" />
              </div>
              <span>Kilat</span>
              <span className="brand-badge">v5.0.0</span>
            </a>

            <nav className="nav-links">
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => navigateTo('home')}
              >
                {lang === 'en' ? 'Overview' : 'Beranda'}
              </button>
              <button 
                className={`nav-link ${currentPage === 'docs' ? 'active' : ''}`}
                onClick={() => navigateTo('docs')}
              >
                {lang === 'en' ? 'Documentation' : 'Dokumentasi'}
              </button>
              <button 
                className={`nav-link ${currentPage === 'benchmarks' ? 'active' : ''}`}
                onClick={() => navigateTo('benchmarks')}
              >
                {lang === 'en' ? 'Benchmarks' : 'Perbandingan'}
              </button>
              <button 
                className={`nav-link ${currentPage === 'changelog' ? 'active' : ''}`}
                onClick={() => navigateTo('changelog')}
              >
                {lang === 'en' ? 'Changelog' : 'Riwayat Rilis'}
              </button>
            </nav>
          </div>

          <div className="nav-actions">
            {/* Language Switcher */}
            <button 
              className="lang-toggle-btn"
              onClick={() => setLang(l => l === 'en' ? 'id' : 'en')}
              title="Toggle Language"
            >
              <SVG.Globe width={14} height={14} />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Quick Search Trigger */}
            <button className="search-trigger" onClick={() => setSearchModalOpen(true)}>
              <SVG.Search width={14} height={14} />
              <span>{lang === 'en' ? 'Search docs...' : 'Cari modul...'}</span>
              <kbd className="kbd-shortcut">Ctrl K</kbd>
            </button>

            <a 
              href="https://github.com/ihsannyy/kilat" 
              target="_blank" 
              rel="noreferrer" 
              className="github-badge-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>GitHub</span>
              <span className="star-pill">v5.0</span>
            </a>

            <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#overview" onClick={(e) => { e.preventDefault(); navigateTo('home') }}>
          {lang === 'en' ? 'Overview' : 'Beranda'}
        </a>
        <a href="#docs" onClick={(e) => { e.preventDefault(); navigateTo('docs') }}>
          {lang === 'en' ? 'Documentation' : 'Dokumentasi'}
        </a>
        <a href="#benchmarks" onClick={(e) => { e.preventDefault(); navigateTo('benchmarks') }}>
          {lang === 'en' ? 'Benchmarks' : 'Perbandingan'}
        </a>
        <a href="#changelog" onClick={(e) => { e.preventDefault(); navigateTo('changelog') }}>
          {lang === 'en' ? 'Changelog' : 'Riwayat Rilis'}
        </a>
        <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">
          GitHub Repository ↗
        </a>
      </div>

      {/* MAIN BODY CONTAINER */}
      <main className="main">
        {/* ================= PAGE 1: HOME / OVERVIEW ================= */}
        {currentPage === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="hero">
              <button onClick={() => navigateTo('changelog')} className="hero-announcement">
                <span className="pulse-beacon">
                  <span className="pulse-ring"></span>
                  <span className="pulse-dot"></span>
                </span>
                <span className="announcement-tag">v5.0.0</span>
                <span>
                  {lang === 'en' 
                    ? 'Native SQLite, In-Memory Cache & Cron Modules Released →'
                    : 'Modul Native SQLite, In-Memory Cache & Cron Dirilis →'}
                </span>
              </button>

              <h1>
                {lang === 'en' ? (
                  <>
                    Ultra-Lightweight JS & TS Runtime<br />
                    <span className="highlight-text">for Termux & Edge Linux</span>
                  </>
                ) : (
                  <>
                    Runtime JavaScript & TypeScript<br />
                    <span className="highlight-text">Ultra-Ringan buat Termux</span>
                  </>
                )}
              </h1>
              
              <p className="hero-subtitle">
                {lang === 'en' 
                  ? 'Sub-2ms cold starts. ~8MB idle memory. Zero node_modules disk waste. Engineered in Go for ultra-fast development on Android, Raspberry Pi, and low-spec systems.'
                  : 'Startup 2ms. RAM cuma 8MB. Tanpa beban node_modules. Dibangun dengan Go untuk performa instan di Android (Termux), Raspberry Pi, dan VPS hemat memori.'}
              </p>

              <div className="hero-actions">
                <button onClick={() => navigateTo('docs')} className="btn-hero-primary">
                  <SVG.BookOpen width={18} height={18} />
                  <span>{lang === 'en' ? 'Explore Documentation' : 'Buka Dokumentasi'}</span>
                </button>

                <button onClick={() => navigateTo('benchmarks')} className="btn-hero-secondary">
                  <SVG.Cpu width={18} height={18} />
                  <span>{lang === 'en' ? 'View Benchmarks' : 'Lihat Benchmark'}</span>
                </button>

                <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="btn-hero-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>

              {/* TERMINAL INSTALLER WITH PLATFORM TABS */}
              <div className="terminal-installer" id="install">
                <div className="terminal-installer-header">
                  <div className="terminal-dots">
                    <span className="terminal-dot dot-red"></span>
                    <span className="terminal-dot dot-yellow"></span>
                    <span className="terminal-dot dot-green"></span>
                  </div>

                  <div className="terminal-installer-tabs">
                    <button 
                      className={`installer-tab-btn ${installerTab === 'termux' ? 'active' : ''}`}
                      onClick={() => setInstallerTab('termux')}
                    >
                      Termux (Android)
                    </button>
                    <button 
                      className={`installer-tab-btn ${installerTab === 'linux' ? 'active' : ''}`}
                      onClick={() => setInstallerTab('linux')}
                    >
                      Linux / macOS
                    </button>
                    <button 
                      className={`installer-tab-btn ${installerTab === 'source' ? 'active' : ''}`}
                      onClick={() => setInstallerTab('source')}
                    >
                      Source (Go)
                    </button>
                    <button 
                      className={`installer-tab-btn ${installerTab === 'windows' ? 'active' : ''}`}
                      onClick={() => setInstallerTab('windows')}
                    >
                      Windows
                    </button>
                  </div>
                </div>

                <div className="terminal-installer-body">
                  <code>{installCommands[installerTab]}</code>
                  <button className={`copy-btn-installer ${copiedInstall ? 'copied' : ''}`} onClick={copyCurrentInstall}>
                    {copiedInstall ? (
                      <>
                        <SVG.Check width={14} height={14} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <SVG.Copy width={14} height={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* METRICS & TELEMETRY GRID */}
            <section className="metrics-section">
              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon"><SVG.Lightning width={22} height={22} /></div>
                  <span className="metric-tag">19x Faster</span>
                </div>
                <div className="metric-value">~2ms</div>
                <div className="metric-label">{lang === 'en' ? 'Cold Start Latency' : 'Waktu Startup'}</div>
                <div className="metric-desc">
                  {lang === 'en' ? 'Instant script boot without heavy V8 JIT warmup overhead.' : 'Start instan tanpa waktu pemanasan JIT compiler V8.'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon"><SVG.Cpu width={22} height={22} /></div>
                  <span className="metric-tag">4x Lighter</span>
                </div>
                <div className="metric-value">~8MB</div>
                <div className="metric-label">{lang === 'en' ? 'Idle Memory Footprint' : 'Konsumsi RAM'}</div>
                <div className="metric-desc">
                  {lang === 'en' ? 'Runs effortlessly on smartphones, IoT boards, and small VPS.' : 'Mulus di smartphone, board Raspberry Pi, dan VPS 512MB.'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon"><SVG.Box width={22} height={22} /></div>
                  <span className="metric-tag">Global Cache</span>
                </div>
                <div className="metric-value">0 MB</div>
                <div className="metric-label">{lang === 'en' ? 'node_modules Duplication' : 'Duplikasi Folder'}</div>
                <div className="metric-desc">
                  {lang === 'en' ? 'Packages are cached centrally in ~/.kilat/packages/.' : 'Paket di-cache terpusat di ~/.kilat/packages/, hemat flash disk.'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon"><SVG.Code width={22} height={22} /></div>
                  <span className="metric-tag">Built-in</span>
                </div>
                <div className="metric-value">15 Modules</div>
                <div className="metric-label">{lang === 'en' ? 'Standard Library' : 'Modul Bawaan'}</div>
                <div className="metric-desc">
                  {lang === 'en' ? 'SQLite, TTL Cache, Cron, HTTP, WebSocket & full TS/TSX support.' : 'SQLite, Cache, Cron, HTTP server, dan eksekusi langsung TS/TSX.'}
                </div>
              </div>
            </section>

            {/* INTERACTIVE IN-BROWSER CODE PLAYGROUND SHOWCASE */}
            <section className="demo-section">
              <div className="demo-container">
                <div className="demo-tabs-sidebar">
                  {codeDemos.map((demo, idx) => (
                    <button 
                      key={demo.id} 
                      className={`demo-tab-btn ${activeCodeTab === idx ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCodeTab(idx)
                      }}
                    >
                      <SVG.Code width={16} height={16} />
                      <span>{demo.title}</span>
                    </button>
                  ))}
                </div>

                <div className="demo-content-area">
                  <div className="demo-header-bar">
                    <div className="demo-file-name">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span>{codeDemos[activeCodeTab].filename}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        className="run-trigger-btn"
                        onClick={runCodeSimulator}
                        title="Simulate execution in Kilat"
                      >
                        <SVG.Play width={12} height={12} />
                        <span>{isRunningDemo ? 'Running...' : 'Run Code (2ms)'}</span>
                      </button>

                      <button 
                        className="copy-code-btn"
                        onClick={() => copySnippet(codeDemos[activeCodeTab].code)}
                      >
                        {copiedCode ? <SVG.Check width={12} height={12} /> : <SVG.Copy width={12} height={12} />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber-light)', background: 'var(--amber-glow)', padding: '2px 8px', borderRadius: '4px' }}>
                        Kilat v5.0 API
                      </span>
                    </div>
                  </div>

                  <div className="demo-code-wrapper">
                    <pre>
                      <code>{codeDemos[activeCodeTab].code}</code>
                    </pre>
                  </div>

                  {/* REALISTIC SIMULATED TERMINAL OUTPUT */}
                  {showConsole && (
                    <div className="demo-console-panel">
                      <div className="demo-console-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <SVG.Terminal width={12} height={12} />
                          <span>Interactive Execution Console</span>
                          <span className="console-badge">Sub-2ms</span>
                        </div>
                        <button 
                          onClick={() => setShowConsole(false)} 
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ✕ Hide
                        </button>
                      </div>

                      {demoOutputs[activeCodeTab].map((row, rIdx) => (
                        <div className="console-row" key={rIdx}>
                          {row.type === 'cmd' && <span className="console-prompt">❯</span>}
                          <span className={
                            row.type === 'success' ? 'console-success' :
                            row.type === 'info' ? 'console-info' :
                            row.type === 'warn' ? 'console-warn' :
                            row.type === 'dim' ? 'console-dim' : 'console-prompt'
                          }>
                            {row.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* FEATURE SUITE SECTION */}
            <section className="section">
              <div className="section-header">
                <span className="section-label">{lang === 'en' ? 'Core Architecture' : 'Arsitektur Engine'}</span>
                <h2 className="section-title">{lang === 'en' ? 'Engine Capabilities & Features' : 'Fitur & Kemampuan Utama'}</h2>
                <p className="section-desc">
                  {lang === 'en'
                    ? 'Built with Go and Goja for maximum throughput on Android (Termux) and Linux without V8 complexity.'
                    : 'Dibangun dengan Go dan Goja untuk kinerja maksimal di Termux dan Linux tanpa beban berlebih Node.js.'}
                </p>
              </div>

              <div className="features-grid">
                {features.map((f, i) => (
                  <div className="feature-card" key={i}>
                    <div className="feature-icon-wrapper">
                      {f.icon}
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PRE-CONFIGURED SCAFFOLDING TEMPLATES */}
            <section className="section">
              <div className="section-header">
                <span className="section-label">{lang === 'en' ? 'Instant Scaffolding' : 'Scaffolding Instan'}</span>
                <h2 className="section-title">{lang === 'en' ? 'Official Starter Templates' : 'Template Proyek Siap Pakai'}</h2>
                <p className="section-desc">
                  {lang === 'en'
                    ? 'Scaffold production-ready projects in seconds with kilat create. No dependencies to download.'
                    : 'Mulai proyek baru dalam hitungan detik dengan kilat create tanpa perlu mengunduh ratusan dependensi.'}
                </p>
              </div>

              <div className="templates-grid">
                {scaffoldingTemplates.map((t) => (
                  <div className="template-card" key={t.id}>
                    <div>
                      <div className="template-badge">{t.tag}</div>
                      <h3 style={{ marginTop: '10px' }}>{t.name}</h3>
                      <p>{t.desc}</p>
                    </div>

                    <div className="template-cmd-box">
                      <code>$ {t.cmd}</code>
                      <button 
                        className="copy-code-btn"
                        onClick={() => copyTemplateCmd(t.id, t.cmd)}
                      >
                        {copiedTemplateId === t.id ? <SVG.Check width={12} height={12} /> : <SVG.Copy width={12} height={12} />}
                        <span>{copiedTemplateId === t.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ARCHITECTURE DEEP DIVE SECTION */}
            <section className="section">
              <div className="section-header">
                <span className="section-label">{lang === 'en' ? 'Deep Dive' : 'Analisis Mendalam'}</span>
                <h2 className="section-title">{lang === 'en' ? 'Why is Kilat so Lightweight?' : 'Mengapa Kilat Jauh Lebih Ringan?'}</h2>
                <p className="section-desc">
                  {lang === 'en'
                    ? 'How Kilat achieves 19x faster cold starts and 4x lower memory consumption compared to standard Node.js on Termux.'
                    : 'Perbandingan teknis cara Kilat mencapai startup 19x lebih cepat dan konsumsi memori 4x lebih kecil dibandingkan Node.js.'}
                </p>
              </div>

              <div className="arch-grid">
                <div className="arch-card highlight">
                  <div className="arch-header">
                    <h3>⚡ Kilat Architecture</h3>
                    <span className="arch-pill pill-amber">Goja + Go Native</span>
                  </div>
                  <p className="arch-desc">
                    Engineered specifically for low-overhead embedded platforms and Android Bionic libc.
                  </p>
                  <ul className="arch-list">
                    <li>
                      <SVG.Check width={16} height={16} className="text-amber" />
                      <span><strong>~2ms cold boot:</strong> Pure Go bytecode interpreter with zero heavy JIT warm-up cycles.</span>
                    </li>
                    <li>
                      <SVG.Check width={16} height={16} className="text-amber" />
                      <span><strong>~8MB memory RSS:</strong> Lightweight memory footprint runs seamlessly on 512MB RAM VPS.</span>
                    </li>
                    <li>
                      <SVG.Check width={16} height={16} className="text-amber" />
                      <span><strong>Shared Global Cache:</strong> Packages live centrally in ~/.kilat/packages/, eliminating disk duplication.</span>
                    </li>
                    <li>
                      <SVG.Check width={16} height={16} className="text-amber" />
                      <span><strong>Direct Goroutine Concurrency:</strong> Web servers and shell commands run directly via Go goroutines.</span>
                    </li>
                  </ul>
                </div>

                <div className="arch-card">
                  <div className="arch-header">
                    <h3>🐢 Traditional Node.js (V8)</h3>
                    <span className="arch-pill pill-dim">V8 JIT Engine</span>
                  </div>
                  <p className="arch-desc">
                    Built for high-end server clusters with hundreds of gigabytes of RAM.
                  </p>
                  <ul className="arch-list">
                    <li style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#f87171', fontWeight: 'bold' }}>✕</span>
                      <span><strong>~38ms+ cold start:</strong> Heavy multi-tier V8 JIT compilation and initialization overhead.</span>
                    </li>
                    <li style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#f87171', fontWeight: 'bold' }}>✕</span>
                      <span><strong>~31MB idle RAM:</strong> Massive baseline runtime memory consumes phone RAM quickly.</span>
                    </li>
                    <li style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#f87171', fontWeight: 'bold' }}>✕</span>
                      <span><strong>Duplicate node_modules:</strong> 10 projects easily consume 1.2GB+ of phone internal storage.</span>
                    </li>
                    <li style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#f87171', fontWeight: 'bold' }}>✕</span>
                      <span><strong>Complex toolchain:</strong> Requires external npm packages even for simple SQLite or Cron tasks.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= PAGE 2: DOCUMENTATION PAGE ================= */}
        {currentPage === 'docs' && (
          <div style={{ padding: '40px 0 80px' }}>
            <div className="section-header">
              <span className="section-label">API Reference</span>
              <h2 className="section-title">Documentation Hub</h2>
              <p className="section-desc">
                {lang === 'en' 
                  ? 'Complete guide covering CLI subcommands, 15 standard library modules, global runtime APIs, and scaffolding templates.'
                  : 'Panduan lengkap mencakup perintah CLI, 15 modul native bawaan, global runtime API, dan template scaffolding.'}
              </p>
            </div>

            <div className="docs-hub-container">
              <div className="docs-sidebar">
                <input 
                  type="text" 
                  className="docs-search-input"
                  placeholder={lang === 'en' ? "Search modules, APIs, commands..." : "Cari modul, API, atau perintah..."}
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Getting Started', 'CLI Tooling', 'Native Modules', 'Global Runtime APIs'].map(cat => {
                    const items = filteredDocs.filter(d => d.cat === cat)
                    if (items.length === 0) return null
                    return (
                      <div key={cat}>
                        <div className="docs-category-title">{cat}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {items.map(item => (
                            <button
                              key={item.id}
                              className={`docs-item-btn ${selectedDoc.id === item.id ? 'active' : ''}`}
                              onClick={() => setSelectedDoc(item)}
                            >
                              <span>{item.title}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="docs-detail-panel">
                <div className="docs-title-badge">
                  <h2>{selectedDoc.title}</h2>
                  <span className="docs-tag">{selectedDoc.tag}</span>
                </div>

                <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {selectedDoc.desc}
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Signature & Usage Example
                    </span>
                    <button 
                      className="copy-code-btn"
                      onClick={() => copySnippet(selectedDoc.code)}
                    >
                      {copiedCode ? <SVG.Check width={12} height={12} /> : <SVG.Copy width={12} height={12} />}
                      <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
                    </button>
                  </div>

                  <div className="docs-code-box">
                    <pre>
                      <code>{selectedDoc.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 3: BENCHMARKS PAGE ================= */}
        {currentPage === 'benchmarks' && (
          <div style={{ padding: '40px 0 80px' }}>
            <div className="section-header">
              <span className="section-label">{lang === 'en' ? 'Performance Metrics' : 'Metrik Kinerja'}</span>
              <h2 className="section-title">{lang === 'en' ? 'Runtime Benchmark Comparison' : 'Perbandingan Performa Runtime'}</h2>
              <p className="section-desc">
                {lang === 'en'
                  ? 'Real-world benchmarks measured on an Android ARM64 Termux environment (Bionic libc).'
                  : 'Pengujian performa nyata diukur pada lingkungan Termux Android ARM64.'}
              </p>
            </div>

            {/* BENCHMARK COMPARISON TABLE */}
            <div className="benchmark-card">
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>{lang === 'en' ? 'Metric' : 'Metrik'}</th>
                    <th>Node.js v20</th>
                    <th>Bun v1.1 (proot)</th>
                    <th>Kilat v5.0.0</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Lightning width={16} height={16} />
                      <span>{lang === 'en' ? 'Cold Start Latency' : 'Waktu Cold Start'}</span>
                    </td>
                    <td className="benchmark-node-val">~38 ms</td>
                    <td className="benchmark-node-val">~18 ms</td>
                    <td className="benchmark-kilat-val">
                      <span>~2 ms</span>
                      <span style={{ fontSize: '11px', color: 'var(--emerald)' }}>(19x faster)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Cpu width={16} height={16} />
                      <span>{lang === 'en' ? 'Idle Memory (RSS)' : 'Konsumsi RAM (RSS)'}</span>
                    </td>
                    <td className="benchmark-node-val">~31 MB</td>
                    <td className="benchmark-node-val">~28 MB</td>
                    <td className="benchmark-kilat-val">
                      <span>~8 MB</span>
                      <span style={{ fontSize: '11px', color: 'var(--emerald)' }}>(4x lighter)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Box width={16} height={16} />
                      <span>{lang === 'en' ? 'Storage (10 Projects)' : 'Penyimpanan (10 Proyek)'}</span>
                    </td>
                    <td className="benchmark-node-val">~1.2 GB</td>
                    <td className="benchmark-node-val">~850 MB</td>
                    <td className="benchmark-kilat-val">
                      <span>0 MB</span>
                      <span style={{ fontSize: '11px', color: 'var(--emerald)' }}>(Global cache)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Code width={16} height={16} />
                      <span>TypeScript / TSX</span>
                    </td>
                    <td className="benchmark-node-val">{lang === 'en' ? 'Requires ts-node/build' : 'Perlu setup build'}</td>
                    <td className="benchmark-node-val">Built-in</td>
                    <td className="benchmark-kilat-val">Built-in (Zero Config)</td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Terminal width={16} height={16} />
                      <span>Native Termux / Android</span>
                    </td>
                    <td className="benchmark-node-val">Heavy package</td>
                    <td className="benchmark-node-val">Unsupported (proot required)</td>
                    <td className="benchmark-kilat-val">Native Single Binary</td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Database width={16} height={16} />
                      <span>Built-in SQLite Database</span>
                    </td>
                    <td className="benchmark-node-val">External npm package</td>
                    <td className="benchmark-node-val">Built-in</td>
                    <td className="benchmark-kilat-val">Built-in (sql module)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* VISUAL BENCHMARK BARS */}
            <div className="benchmark-visual-grid">
              <div className="benchmark-visual-card">
                <div className="benchmark-visual-title">
                  <SVG.Lightning width={18} height={18} className="text-amber" />
                  <span>Cold Start Latency</span>
                  <span className="benchmark-visual-unit">(Lower is better)</span>
                </div>
                <div className="benchmark-bars-group">
                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name target-kilat">Kilat v5.0</span>
                      <span className="benchmark-target-val val-kilat">~2ms</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-kilat" style={{ width: '6%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Bun v1.1</span>
                      <span className="benchmark-target-val">~18ms</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-bun" style={{ width: '47%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Node.js v20</span>
                      <span className="benchmark-target-val">~38ms</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-node" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="benchmark-visual-card">
                <div className="benchmark-visual-title">
                  <SVG.Cpu width={18} height={18} className="text-amber" />
                  <span>Idle Memory (RSS)</span>
                  <span className="benchmark-visual-unit">(Lower is better)</span>
                </div>
                <div className="benchmark-bars-group">
                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name target-kilat">Kilat v5.0</span>
                      <span className="benchmark-target-val val-kilat">~7.8MB</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-kilat" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Bun v1.1</span>
                      <span className="benchmark-target-val">~28MB</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-bun" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Node.js v20</span>
                      <span className="benchmark-target-val">~31MB</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-node" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="benchmark-visual-card">
                <div className="benchmark-visual-title">
                  <SVG.Box width={18} height={18} className="text-amber" />
                  <span>Storage (10 Projects)</span>
                  <span className="benchmark-visual-unit">(Lower is better)</span>
                </div>
                <div className="benchmark-bars-group">
                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name target-kilat">Kilat v5.0</span>
                      <span className="benchmark-target-val val-kilat">0 MB (Shared)</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-kilat" style={{ width: '2%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Bun v1.1</span>
                      <span className="benchmark-target-val">~850MB</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-bun" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div className="benchmark-row">
                    <div className="benchmark-row-header">
                      <span className="benchmark-target-name">Node.js v20</span>
                      <span className="benchmark-target-val">~1,200MB</span>
                    </div>
                    <div className="benchmark-bar-track">
                      <div className="benchmark-bar-fill bar-node" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 4: CHANGELOG PAGE ================= */}
        {currentPage === 'changelog' && (
          <div style={{ padding: '40px 0 80px' }}>
            <div className="section-header">
              <span className="section-label">Release History</span>
              <h2 className="section-title">Changelog & Milestones</h2>
              <p className="section-desc">
                {lang === 'en'
                  ? 'Complete version timeline of Kilat engine features, standard library modules, and updates.'
                  : 'Catatan pembaruan dan evolusi arsitektur runtime Kilat dari versi awal hingga terkini.'}
              </p>
            </div>

            <div className="timeline">
              {versions.map((v, i) => (
                <div className="timeline-item" key={i}>
                  <div>
                    <div className="version-badge-num">{v.num}</div>
                    <div className="version-badge-date">{v.date}</div>
                  </div>

                  <div className="version-details">
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>

                  <span className={`release-pill ${v.latest ? 'latest' : ''}`}>
                    {v.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* QUICK SEARCH DIALOG MODAL */}
      {searchModalOpen && (
        <div className="modal-overlay" onClick={() => setSearchModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-search-header">
              <SVG.Search width={18} height={18} className="text-amber" />
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Search Kilat modules, commands, APIs... (Press ESC to close)" : "Cari modul, API, atau perintah... (Tekan ESC untuk tutup)"}
                value={searchModalQuery}
                onChange={(e) => setSearchModalQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-results-list">
              {modalSearchResults.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  No matching documentation items found.
                </div>
              ) : (
                modalSearchResults.map(item => (
                  <div 
                    key={item.id} 
                    className="modal-result-item"
                    onClick={() => {
                      setSelectedDoc(item)
                      navigateTo('docs')
                      setSearchModalOpen(false)
                    }}
                  >
                    <div>
                      <div className="modal-result-title">{item.title}</div>
                      <div className="modal-result-sub">{item.cat} • {item.tag}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="brand-icon-wrapper">
                <img src="/kilat.png" alt="Kilat Logo" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>Kilat</span>
            </div>
            <p>
              The ultra-lightweight JavaScript and TypeScript runtime engineered for Termux, Android, and resource-constrained Linux systems.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Resources</div>
            <div className="footer-links-list">
              <a href="#overview" onClick={(e) => { e.preventDefault(); navigateTo('home') }}>Overview</a>
              <a href="#docs" onClick={(e) => { e.preventDefault(); navigateTo('docs') }}>Documentation</a>
              <a href="#benchmarks" onClick={(e) => { e.preventDefault(); navigateTo('benchmarks') }}>Benchmarks</a>
              <a href="#changelog" onClick={(e) => { e.preventDefault(); navigateTo('changelog') }}>Changelog</a>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Templates</div>
            <div className="footer-links-list">
              <a href="#docs" onClick={() => navigateTo('docs')}>vanilla</a>
              <a href="#docs" onClick={() => navigateTo('docs')}>react + vite</a>
              <a href="#docs" onClick={() => navigateTo('docs')}>hono server</a>
              <a href="#docs" onClick={() => navigateTo('docs')}>api server</a>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Community</div>
            <div className="footer-links-list">
              <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">GitHub Repository</a>
              <a href="https://github.com/ihsannyy/kilat/releases" target="_blank" rel="noreferrer">Releases</a>
              <a href="https://github.com/ihsannyy/kilat/issues" target="_blank" rel="noreferrer">Issue Tracker</a>
              <a href="https://raw.githubusercontent.com/ihsannyy/kilat/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Kilat by <a href="https://github.com/ihsannyy" target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>ihsannyy</a>. Released under the MIT License.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Built with Go & React</span>
            <span>•</span>
            <span>Optimized for Termux</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
