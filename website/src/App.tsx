import { useState } from 'react'

const versions = [
  {
    num: 'v4.1.0',
    date: '12 Sep 2026',
    title: 'Template System & CLI Improvements',
    desc: 'Added kilat create with 5 templates (vanilla, react, hono, vite, api). New Kilat.serve() API. kilat info command. Humanized documentation.',
    latest: true,
  },
  {
    num: 'v4.0.0',
    date: '12 Sep 2026',
    title: '6 Built-in Modules',
    desc: 'Timers, Buffer, Path, Child Process, Streams, WebSocket Client. TextEncoder/TextDecoder, process object, atob/btoa, queueMicrotask, setImmediate.',
    latest: false,
  },
  {
    num: 'v3.1.0',
    date: '13 Jul 2026',
    title: 'Build & Remove Commands',
    desc: 'kilat remove for uninstalling packages. kilat build for bundling and minifying JS/TS. Fallback DNS resolver for Termux.',
    latest: false,
  },
  {
    num: 'v2.1.0',
    date: '11 Jul 2026',
    title: 'Global Shell Execution',
    desc: 'Global $ command for async shell execution using Go goroutines.',
    latest: false,
  },
  {
    num: 'v2.0.0',
    date: '1 Jul 2026',
    title: 'Fetch API',
    desc: 'Global fetch() for async HTTP requests integrated with event-loop.',
    latest: false,
  },
  {
    num: 'v1.0.0',
    date: '20 Jun 2026',
    title: 'Initial Release',
    desc: 'esbuild integration for TypeScript and ES Modules loading.',
    latest: false,
  },
]

const features = [
  { icon: '⚡', title: '2ms Startup', desc: 'Goja engine, no V8 overhead.' },
  { icon: '📦', title: 'Global Cache', desc: 'Packages in ~/.kilat/packages/, zero duplication.' },
  { icon: '🔧', title: 'TypeScript Built-in', desc: '.ts/.tsx transpile in memory via esbuild.' },
  { icon: '🌐', title: 'Fetch API', desc: 'Async HTTP requests with Promises.' },
  { icon: '🔌', title: 'Kilat.serve', desc: 'HTTP server with Bun-compatible API.' },
  { icon: '📋', title: 'Create Templates', desc: 'Scaffold projects with kilat create.' },
  { icon: '👁️', title: 'Watch Mode', desc: 'Auto-restart on file changes.' },
  { icon: '🧩', title: 'Package Manager', desc: 'kilat add, kilat remove commands.' },
  { icon: '💻', title: 'REPL', desc: 'Interactive JavaScript shell.' },
]

const modules = [
  { name: 'fs', desc: 'File I/O' },
  { name: 'os', desc: 'System info' },
  { name: 'path', desc: 'Path utils' },
  { name: 'crypto', desc: 'Hashing' },
  { name: 'child_process', desc: 'Shell exec' },
  { name: 'buffer', desc: 'Binary data' },
  { name: 'stream', desc: 'Streams' },
  { name: 'timers', desc: 'setTimeout' },
  { name: 'websocket', desc: 'WS client' },
]

export default function App() {
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="site">
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="nav-brand">
            <img src="/kilat.png" alt="Kilat" />
            <span>kilat</span>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#versions" className="nav-link">Changelog</a>
            <a href="#modules" className="nav-link">Modules</a>
          </div>
          <div className="nav-actions">
            <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="nav-btn nav-btn-outline">GitHub</a>
            <a href="#install" className="nav-btn">Install</a>
            <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
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

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
        <a href="#versions" onClick={() => setMobileOpen(false)}>Changelog</a>
        <a href="#modules" onClick={() => setMobileOpen(false)}>Modules</a>
        <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">GitHub</a>
      </div>

      <main className="main">
        <section className="hero">
          <div className="hero-badge">
            <span className="dot"></span>
            v4.1.0 — Latest Release
          </div>
          <h1>kilat</h1>
          <p>JavaScript runtime untuk Termux & Linux. Ringan, cepat, tanpa node_modules.</p>
          <div className="hero-actions">
            <a href="#install" className="btn-primary">Get Started</a>
            <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="btn-secondary">View on GitHub</a>
          </div>

          <div className="terminal" id="install">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
              </div>
              <span className="terminal-title">terminal</span>
            </div>
            <div className="terminal-body">
              <code>curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash</code>
              <button className="copy-btn" onClick={copyInstall}>
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">Kenapa Kilat?</h2>
          <p className="section-desc">Node.js terlalu berat buat Termux. Kilat hadir sebagai alternatif yang lebih ringan.</p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="comparison">
          <div className="section-label">Comparison</div>
          <h2 className="section-title">Node.js vs Kilat</h2>
          <p className="section-desc">Perbandingan langsung dengan Node.js di perangkat yang sama.</p>

          <div className="comparison">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Node.js v20</th>
                  <th>Kilat v4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Startup time</td>
                  <td>~38ms</td>
                  <td className="highlight">~2ms</td>
                </tr>
                <tr>
                  <td>RAM usage</td>
                  <td>~31MB</td>
                  <td className="highlight">~8MB</td>
                </tr>
                <tr>
                  <td>Storage per project</td>
                  <td>~120MB</td>
                  <td className="highlight">0B (global cache)</td>
                </tr>
                <tr>
                  <td>TypeScript</td>
                  <td>External (ts-node)</td>
                  <td className="highlight">Built-in (esbuild)</td>
                </tr>
                <tr>
                  <td>Module system</td>
                  <td>node_modules/project</td>
                  <td className="highlight">Global cache</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="versions">
          <div className="section-label">Changelog</div>
          <h2 className="section-title">Version History</h2>
          <p className="section-desc">Semua rilis dari awal sampai sekarang.</p>

          <div className="versions">
            {versions.map((v, i) => (
              <div className="version-item" key={i}>
                <div>
                  <div className="version-num">{v.num}</div>
                  <div className="version-date">{v.date}</div>
                </div>
                <div className="version-content">
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
                {v.latest ? (
                  <span className="version-tag latest">Latest</span>
                ) : (
                  <span className="version-tag">Release</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="modules">
          <div className="section-label">Modules</div>
          <h2 className="section-title">Built-in Modules</h2>
          <p className="section-desc">Modul yang sudah terintegrasi tanpa perlu install.</p>

          <div className="modules-grid">
            {modules.map((m, i) => (
              <div className="module-card" key={i}>
                <h4>{m.name}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="quickstart">
          <div className="section-label">Quick Start</div>
          <h2 className="section-title">Mulai Dalam 30 Detik</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { step: '01', code: 'curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash' },
              { step: '02', code: 'kilat create vanilla my-app' },
              { step: '03', code: 'cd my-app && kilat run src/index.js' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg)', padding: '20px 24px', display: 'grid', gridTemplateColumns: '40px 1fr', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>{s.step}</span>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--text-secondary)' }}>{s.code}</code>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-text">MIT License © 2026 Kilat</span>
          <div className="footer-links">
            <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://github.com/ihsannyy/kilat/issues" target="_blank" rel="noreferrer">Issues</a>
            <a href="https://github.com/ihsannyy/kilat/blob/main/LICENSE" target="_blank" rel="noreferrer">License</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
