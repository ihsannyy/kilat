import { useState, useEffect } from 'react'

// Professional SVG Icons collection replacing all emojis
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
  )
}

// Interactive Code Demo Snippets
const codeDemos = [
  {
    id: 'server',
    title: 'Bun-Style HTTP Server',
    filename: 'server.js',
    code: `// Kilat v5.0.0 Native High-Throughput HTTP Server
Kilat.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/telemetry") {
      return Response.json({
        status: "operational",
        engine: "Kilat v5.0.0",
        coldStart: "< 1.8ms",
        memoryRSS: "7.8MB"
      });
    }
    return new Response("⚡ Kilat v5.0.0 Enterprise Server Running!");
  },
});

console.log("🚀 Server initialized on http://localhost:3000");`
  },
  {
    id: 'fetch',
    title: 'Async Fetch API',
    filename: 'fetch-api.js',
    code: `// Built-in Fetch API with Promise event loop integration
async function queryGitHubData(username) {
  try {
    const res = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    console.log(\`👤 User: \${data.name} (@\${data.login})\`);
    console.log(\`📦 Repositories: \${data.public_repos}\`);
  } catch (err) {
    console.error("Fetch request failed:", err.message);
  }
}

queryGitHubData("ihsannyy");`
  },
  {
    id: 'http',
    title: 'Node.js HTTP Server',
    filename: 'node-http.js',
    code: `// Node.js HTTP compatibility layer
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    version: "v5.0.0",
    module: "http",
    timestamp: Date.now()
  }));
});

server.listen(8080, () => {
  console.log("🌐 HTTP server listening on port 8080");
});`
  },
  {
    id: 'events',
    title: 'EventEmitter Architecture',
    filename: 'events.js',
    code: `// Event-driven system with EventEmitter
const { EventEmitter } = require('events');

class TelemetryEngine extends EventEmitter {}
const bus = new TelemetryEngine();

bus.on('metric:coldstart', (data) => {
  console.log(\`[METRIC] Latency: \${data.latency}ms | Footprint: \${data.rss}\`);
});

bus.emit('metric:coldstart', { latency: 1.8, rss: '7.8MB' });`
  },
  {
    id: 'shell',
    title: 'Global Shell Goroutines ($)',
    filename: 'shell.ts',
    code: `// TypeScript native with async shell goroutines
import { os } from 'kilat/os';

console.log(\`Platform: \${os.platform()} (\${os.arch()})\`);

// Run shell commands asynchronously via Go goroutines
const kernelInfo = await $('uname -a');
console.log("System Kernel:", kernelInfo.trim());`
  }
]

// Version Release History (Latest v5.0.0)
const versions = [
  {
    num: 'v5.0.0',
    date: '16 Sep 2026',
    tag: 'Latest Release',
    title: 'Kilat Native Modules',
    desc: 'Module sendiri: log, events, cache, cron, sql. Error handling konsisten. Gak ada dependensi Node.js.',
    latest: true,
  },
  {
    num: 'v4.2.0',
    date: '12 Sep 2026',
    tag: 'HTTP Engine',
    title: 'HTTP & Socket',
    desc: 'EventEmitter, HTTP server, TCP sockets, querystring, util.promisify.',
    latest: false,
  },
  {
    num: 'v4.1.0',
    date: '12 Sep 2026',
    tag: 'Scaffolding',
    title: 'Template Generator',
    desc: 'kilat create dengan template vanilla, react, hono, vite, api. Kilat.serve() API.',
    latest: false,
  },
  {
    num: 'v4.0.0',
    date: '12 Sep 2026',
    tag: 'Core Upgrade',
    title: 'Module System',
    desc: 'Timers, Buffer, Path, Child Process, Streams, WebSocket. TextEncoder/TextDecoder, process object.',
    latest: false,
  },
  {
    num: 'v3.1.0',
    date: '13 Jul 2026',
    tag: 'Tooling',
    title: 'Global Package Cache & Bundler',
    desc: 'kilat remove command, kilat build for bundling & minifying JS/TS binaries. Fallback DNS resolver for Android Termux.',
    latest: false,
  },
  {
    num: 'v2.1.0',
    date: '11 Jul 2026',
    tag: 'Feature',
    title: 'Goroutine Async Shell Execution ($)',
    desc: 'Global $ operator for zero-overhead async shell command execution powered by Go goroutines.',
    latest: false,
  },
  {
    num: 'v1.0.0',
    date: '20 Jun 2026',
    tag: 'Initial Release',
    title: 'Goja ECMAScript Engine Initialization',
    desc: 'Initial release with embedded Goja ECMAScript engine and esbuild for instant memory transpile of TypeScript.',
    latest: false,
  },
]

// Stats
const stats = [
  {
    icon: <SVG.Lightning width={22} height={22} className="text-amber" />,
    val: '~2ms',
    label: 'Startup',
    desc: 'Startup 2ms, gak pakai V8.',
    tag: 'Cepat'
  },
  {
    icon: <SVG.Server width={22} height={22} className="text-amber" />,
    val: '~8MB',
    label: 'RAM',
    desc: 'RAM cuma 8MB.',
    tag: 'Ringan'
  },
  {
    icon: <SVG.Box width={22} height={22} className="text-amber" />,
    val: '0',
    label: 'node_modules',
    desc: 'Gak ada node_modules, package di-cache global.',
    tag: 'Hemat'
  },
  {
    icon: <SVG.Code width={22} height={22} className="text-amber" />,
    val: 'Built-in',
    label: 'TypeScript',
    desc: 'File .ts/.tsx langsung jalan.',
    desc: 'File .ts/.tsx langsung jalan, gak perlu ts-node atau konfigurasi.',
    tag: 'Built-in'
  }
]

// Feature Suite Cards
const features = [
  {
    icon: <SVG.Lightning width={24} height={24} />,
    title: 'Startup Cepat',
    desc: '2ms startup, gak pakai V8. Langsung jalan.'
  },
  {
    icon: <SVG.Box width={24} height={24} />,
    title: 'Global Cache',
    desc: 'Package disimpan di ~/.kilat/packages/. Hemat storage.'
  },
  {
    icon: <SVG.Code width={24} height={24} />,
    title: 'TypeScript Built-in',
    desc: '.ts/.tsx langsung jalan, gak perlu setup tambahan.'
  },
  {
    icon: <SVG.Globe width={24} height={24} />,
    title: 'Fetch API',
    desc: 'HTTP request pakai fetch, sama kayak di browser.'
  },
  {
    icon: <SVG.Server width={24} height={24} />,
    title: 'HTTP Server',
    desc: 'Kilat.serve() buat bikin server.'
  },
  {
    icon: <SVG.Template width={24} height={24} />,
    title: 'Template System',
    desc: 'kilat create buat scaffolding project.'
  },
  {
    icon: <SVG.Eye width={24} height={24} />,
    title: 'Watch Mode',
    desc: 'Auto-restart kalau file berubah.'
  },
  {
    icon: <SVG.Layers width={24} height={24} />,
    title: 'Package Manager',
    desc: 'kilat add, kilat remove. Gampang.'
  },
  {
    icon: <SVG.Terminal width={24} height={24} />,
    title: 'REPL',
    desc: 'Interactive shell buat test kode langsung.'
  },
]

// Documentation Hub Items
const docsItems = [
  {
    id: 'intro',
    cat: 'Getting Started',
    title: 'Tentang Kilat',
    tag: 'Overview',
    desc: 'Kilat itu runtime JavaScript yang ringan. Startup 2ms, RAM 8MB, gak ada node_modules.',
    code: `// Jalankan file JS/TS
$ kilat run index.ts

// Lihat info runtime
$ kilat info`
  },
  {
    id: 'cli-create',
    cat: 'CLI Commands',
    title: 'kilat create [template] [name]',
    tag: 'Scaffolding',
    desc: 'Bikin project baru dari template. Vanilla, react, hono, vite, api.',
    code: `$ kilat create hono my-api
$ cd my-api
$ kilat run src/index.js`
  },
  {
    id: 'cli-add',
    cat: 'CLI Commands',
    title: 'kilat add <package>',
    tag: 'Package Manager',
    desc: 'Install package ke ~/.kilat/packages/.',
    code: `$ kilat add lodash-es
$ kilat add hono`
  },
  {
    id: 'cli-build',
    cat: 'CLI Commands',
    title: 'kilat build <entry>',
    tag: 'Bundler',
    desc: 'Bundle & minify JS/TS jadi satu file.',
    code: `$ kilat build src/index.ts -o dist/bundle.js`
  },
  {
    id: 'mod-log',
    cat: 'Core Modules',
    title: 'log',
    tag: 'Logging',
    desc: 'Structured logging dengan warna. info, warn, error, debug, success.',
    code: `log.info("Server started on port 3000");
log.error("Failed to connect:", err);
log.warn("Low memory");
log.debug("Debug info");`
  },
  {
    id: 'mod-events',
    cat: 'Core Modules',
    title: 'events',
    tag: 'Event Driven',
    desc: 'Simple pub/sub event system. on, off, emit, once.',
    code: `events.on("data", (msg) => log.info(msg));
events.emit("data", "Hello");
events.once("ready", () => log.info("Ready!"));`
  },
  {
    id: 'mod-cache',
    cat: 'Core Modules',
    title: 'cache',
    tag: 'Storage',
    desc: 'Key-value cache dengan TTL. set, get, delete, has.',
    code: `cache.set("token", "abc123", 3600); // TTL 1 jam
const token = cache.get("token");
cache.delete("token");`
  },
  {
    id: 'mod-cron',
    cat: 'Core Modules',
    title: 'cron',
    tag: 'Scheduler',
    desc: 'Scheduled tasks. every, after, stop.',
    code: `cron.every("5s", () => log.debug("heartbeat"));
cron.after("10s", () => log.info("delayed task"));
cron.stop();`
  },
  {
    id: 'mod-sql',
    cat: 'Core Modules',
    title: 'sql',
    tag: 'Database',
    desc: 'SQLite database. open, query, execute.',
    code: `const db = sql.open("app.db");
db.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
db.execute("INSERT INTO users (name) VALUES (?)", ["Budi"]);
const users = db.query("SELECT * FROM users");`
  },
  {
    id: 'mod-fs',
    cat: 'Core Modules',
    title: 'fs',
    tag: 'File I/O',
    desc: 'File system operations: readFile, writeFile, readdir, mkdir.',
    code: `const content = fs.readFileSync('config.json', 'utf-8');
console.log("Config:", JSON.parse(content));`
  },
  {
    id: 'mod-websocket',
    cat: 'Core Modules',
    title: 'websocket',
    tag: 'Real-Time',
    desc: 'WebSocket client buat real-time communication.',
    code: `const ws = new WebSocket('wss://echo.websocket.events');
ws.on('open', () => ws.send('Hello'));
ws.on('message', (msg) => log.info('Received:', msg));`
  },
  {
    id: 'api-serve',
    cat: 'Global APIs',
    title: 'Kilat.serve()',
    tag: 'Web Server',
    desc: 'HTTP server. Port, fetch handler.',
    code: `Kilat.serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello!");
  }
});`
  },
  {
    id: 'api-shell',
    cat: 'Global APIs',
    title: '$ Shell Exec',
    tag: 'Shell',
    desc: 'Async shell execution.',
    code: `const uptime = await $('uptime');
console.log("Uptime:", uptime.text());`
  }
]

export default function App() {
  // Page Routing State: 'home' | 'docs' | 'benchmarks' | 'changelog'
  const [currentPage, setCurrentPage] = useState<'home' | 'docs' | 'benchmarks' | 'changelog'>('home')
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedDoc, setSelectedDoc] = useState(docsItems[0])
  const [searchDocQuery, setSearchDocQuery] = useState('')
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchModalQuery, setSearchModalQuery] = useState('')

  // Sync route with URL hash on load & change
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

  // Handle Ctrl+K keyboard shortcut for search modal
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

  const copyInstall = () => {
    navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash')
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
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
      {/* NAVIGATION BAR */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#overview" className="nav-brand" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <div className="brand-icon-wrapper">
              <img src="/kilat.png" alt="Kilat Logo" />
            </div>
            <span>kilat</span>
            <span className="brand-badge">v5.0.0</span>
          </a>

          <div className="nav-center">
            <div className="nav-links">
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                onClick={() => navigateTo('home')}
              >
                Overview
              </button>
              <button 
                className={`nav-link ${currentPage === 'docs' ? 'active' : ''}`} 
                onClick={() => navigateTo('docs')}
              >
                Documentation
              </button>
              <button 
                className={`nav-link ${currentPage === 'benchmarks' ? 'active' : ''}`} 
                onClick={() => navigateTo('benchmarks')}
              >
                Benchmarks
              </button>
              <button 
                className={`nav-link ${currentPage === 'changelog' ? 'active' : ''}`} 
                onClick={() => navigateTo('changelog')}
              >
                Changelog
              </button>
            </div>

            <button className="search-trigger" onClick={() => setSearchModalOpen(true)}>
              <SVG.Search width={14} height={14} />
              <span>Search Docs...</span>
              <span className="kbd-shortcut">⌘K</span>
            </button>
          </div>

          <div className="nav-actions">
            <a 
              href="https://github.com/ihsannyy/kilat" 
              target="_blank" 
              rel="noreferrer" 
              className="github-badge-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
              <span className="star-pill">★ 1.2k</span>
            </a>
            <button className="btn-cta-nav" onClick={() => navigateTo('docs')}>Get Started</button>

            <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER NAV */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#overview" onClick={() => navigateTo('home')}>Overview</a>
        <a href="#docs" onClick={() => navigateTo('docs')}>Documentation</a>
        <a href="#benchmarks" onClick={() => navigateTo('benchmarks')}>Benchmarks</a>
        <a href="#changelog" onClick={() => navigateTo('changelog')}>Changelog</a>
        <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">GitHub Repository</a>
      </div>

      <main className="main">
        {/* ================= PAGE 1: HOME / OVERVIEW ================= */}
        {currentPage === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="hero">
              <button onClick={() => navigateTo('changelog')} className="hero-announcement">
                <span className="announcement-tag">v5.0.0</span>
                <span>v5.0.0 — Kilat Native Modules Released →</span>
              </button>

              <h1>
                Runtime JavaScript<br />
                <span className="highlight-text">yang Ringan</span>
              </h1>
              
              <p className="hero-subtitle">
                Buat kamu yang males nunggu Node.js startup lama. Startup 2ms, RAM 8MB, gak ada node_modules.
              </p>

              <div className="hero-actions">
                <button onClick={() => navigateTo('docs')} className="btn-hero-primary">
                  <SVG.BookOpen width={18} height={18} />
                  <span>Explore Documentation</span>
                </button>

                <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="btn-hero-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  <span>Source Repository</span>
                </a>
              </div>

              {/* TERMINAL INSTALLER */}
              <div className="terminal-installer" id="install">
                <div className="terminal-installer-header">
                  <div className="terminal-dots">
                    <span className="terminal-dot dot-red"></span>
                    <span className="terminal-dot dot-yellow"></span>
                    <span className="terminal-dot dot-green"></span>
                  </div>
                  <div className="terminal-installer-title">
                    <SVG.Terminal width={12} height={12} />
                    <span>bash installer command</span>
                  </div>
                </div>
                <div className="terminal-installer-body">
                  <code>curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash</code>
                  <button className={`copy-btn-installer ${copied ? 'copied' : ''}`} onClick={copyInstall}>
                    {copied ? (
                      <>
                        <SVG.Check width={14} height={14} />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <SVG.Copy width={14} height={14} />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* METRICS & TELEMETRY GRID */}
            <section className="metrics-section">
              {stats.map((m, idx) => (
                <div className="metric-card" key={idx}>
                  <div className="metric-header">
                    <div className="metric-icon">{m.icon}</div>
                    <span className="metric-tag">{m.tag}</span>
                  </div>
                  <div className="metric-value">{m.val}</div>
                  <div className="metric-label">{m.label}</div>
                  <div className="metric-desc">{m.desc}</div>
                </div>
              ))}
            </section>

            {/* CODE PLAYGROUND SHOWCASE */}
            <section className="demo-section">
              <div className="demo-container">
                <div className="demo-tabs-sidebar">
                  {codeDemos.map((demo, idx) => (
                    <button 
                      key={demo.id} 
                      className={`demo-tab-btn ${activeTab === idx ? 'active' : ''}`}
                      onClick={() => setActiveTab(idx)}
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
                      <span>{codeDemos[activeTab].filename}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber-light)', background: 'var(--amber-glow)', padding: '2px 8px', borderRadius: '4px' }}>
                      Kilat v5.0.0 API
                    </span>
                  </div>

                  <div className="demo-code-wrapper">
                    <pre>
                      <code>{codeDemos[activeTab].code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURE SUITE SECTION */}
            <section className="section">
              <div className="section-header">
                <span className="section-label">Capabilities</span>
                <h2 className="section-title">Engine Architecture & Features</h2>
                <p className="section-desc">
                  Built with Go and Goja for maximum throughput on Termux without heavy Node.js or V8 footprint.
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
          </div>
        )}

        {/* ================= PAGE 2: DOCUMENTATION PAGE ================= */}
        {currentPage === 'docs' && (
          <div style={{ padding: '40px 0 80px' }}>
            <div className="section-header">
              <span className="section-label">Documentation Hub</span>
              <h2 className="section-title">Kilat v5.0.0 API & Reference</h2>
              <p className="section-desc">
                Comprehensive guide for CLI commands, built-in standard library modules, global objects, and templates.
              </p>
            </div>

            <div className="docs-hub-container">
              <div className="docs-sidebar">
                <input 
                  type="text" 
                  className="docs-search-input"
                  placeholder="Filter documentation topics..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Getting Started', 'CLI Commands', 'Core Modules', 'Global APIs'].map(cat => {
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
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Code Example & Signature
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
              <span className="section-label">Perbandingan</span>
              <h2 className="section-title">Benchmarks</h2>
              <p className="section-desc">
                Diukur di Termux ARM64.
              </p>
            </div>

            <div className="benchmark-card">
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>Metrik</th>
                    <th>Node.js v20</th>
                    <th>Bun v1.1</th>
                    <th>Kilat v5.0.0</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Lightning width={16} height={16} />
                      <span>Startup</span>
                    </td>
                    <td className="benchmark-node-val">~38ms</td>
                    <td className="benchmark-node-val">~18ms</td>
                    <td className="benchmark-kilat-val">
                      <span>~2ms</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Cpu width={16} height={16} />
                      <span>RAM</span>
                    </td>
                    <td className="benchmark-node-val">~31MB</td>
                    <td className="benchmark-node-val">~28MB</td>
                    <td className="benchmark-kilat-val">~8MB</td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Box width={16} height={16} />
                      <span>Storage (10 proyek)</span>
                    </td>
                    <td className="benchmark-node-val">~1.2GB</td>
                    <td className="benchmark-node-val">~850MB</td>
                    <td className="benchmark-kilat-val">0 (global cache)</td>
                  </tr>
                  <tr>
                    <td className="benchmark-metric-name">
                      <SVG.Code width={16} height={16} />
                      <span>TypeScript</span>
                    </td>
                    <td className="benchmark-node-val">Perlu setup</td>
                    <td className="benchmark-node-val">Built-in</td>
                    <td className="benchmark-kilat-val">Built-in</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PAGE 4: CHANGELOG PAGE ================= */}
        {currentPage === 'changelog' && (
          <div style={{ padding: '40px 0 80px' }}>
            <div className="section-header">
              <span className="section-label">Release Notes</span>
              <h2 className="section-title">Version Release History</h2>
              <p className="section-desc">
                Complete evolution timeline of Kilat engine features and architecture.
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
                placeholder="Search Kilat documentation, modules, APIs... (Press ESC to close)"
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
                      setSearchModalOpen(false)
                      navigateTo('docs')
                    }}
                  >
                    <div>
                      <div className="modal-result-title">{item.title}</div>
                      <div className="modal-result-sub">{item.cat} • {item.desc.substring(0, 70)}...</div>
                    </div>
                    <span className="docs-tag">{item.tag}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ENTERPRISE FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <button onClick={() => navigateTo('home')} className="nav-brand" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div className="brand-icon-wrapper">
                <img src="/kilat.png" alt="Kilat Logo" />
              </div>
              <span>kilat</span>
            </button>
            <p>
              Ultra-lightweight high-performance JavaScript & TypeScript runtime built with Go & Goja for Termux and Linux systems.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Core Engine</div>
            <div className="footer-links-list">
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Overview</button>
              <button onClick={() => navigateTo('benchmarks')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Telemetry Benchmarks</button>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>TypeScript Transpiler</button>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Global Package Cache</button>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Documentation</div>
            <div className="footer-links-list">
              <button onClick={() => { setSelectedDoc(docsItems[1]); navigateTo('docs'); }} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>CLI Commands</button>
              <button onClick={() => { setSelectedDoc(docsItems[4]); navigateTo('docs'); }} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>HTTP Server API</button>
              <button onClick={() => { setSelectedDoc(docsItems[5]); navigateTo('docs'); }} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>EventEmitter Engine</button>
              <button onClick={() => { setSelectedDoc(docsItems[7]); navigateTo('docs'); }} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>WebSocket Client</button>
            </div>
          </div>

          <div>
            <div className="footer-column-title">Community</div>
            <div className="footer-links-list">
              <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">GitHub Repository</a>
              <a href="https://github.com/ihsannyy/kilat/issues" target="_blank" rel="noreferrer">Issue Tracker</a>
              <a href="https://github.com/ihsannyy/kilat/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>
              <button onClick={() => navigateTo('changelog')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Release Timeline</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>MIT License © 2026</span>
        </div>
      </footer>
    </div>
  )
}
