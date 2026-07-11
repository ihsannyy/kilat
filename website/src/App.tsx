import { useState, useEffect } from 'react'

interface CodeTemplate {
  name: string
  code: string
  output: string[]
}

const templates: Record<string, CodeTemplate> = {
  typescript: {
    name: 'main.ts',
    code: `const run = (task: string): void => {
  console.log(\`⚡ Running \${task}...\`);
};
run('TypeScript compiler');`,
    output: [
      '🚀 Transpiled TS in 1.2ms',
      '⚡ Running TypeScript compiler...'
    ]
  },
  fetch: {
    name: 'fetch.js',
    code: `async function getIP() {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  console.log('IP:', data.ip);
}
getIP();`,
    output: [
      '📡 Requesting ipify.org...',
      'IP: 182.2.45.109'
    ]
  },
  shell: {
    name: 'exec.js',
    code: `async function sys() {
  const info = await $\`uname -m\`;
  console.log('Architecture:', info.stdout.trim());
}
sys();`,
    output: [
      '⚡ Shell command executed...',
      'Architecture: aarch64'
    ]
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [selectedDemo, setSelectedDemo] = useState<string>('typescript')
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  const runCode = () => {
    setIsRunning(true)
    setTerminalLogs(['$ kilat run ' + templates[selectedDemo].name])
    
    let i = 0
    const lines = templates[selectedDemo].output
    const timer = setInterval(() => {
      if (i < lines.length) {
        setTerminalLogs(prev => [...prev, lines[i]])
        i++
      } else {
        clearInterval(timer)
        setIsRunning(false)
      }
    }, 400)
  }

  useEffect(() => {
    setTerminalLogs(['$ press active button to run ' + templates[selectedDemo].name])
  }, [selectedDemo])

  return (
    <div className="workstation-portal">
      <div className="mesh-glow purple-glow"></div>
      <div className="mesh-glow cyan-glow"></div>
      <div className="scanlines"></div>

      <header className="control-header">
        <div className="header-brand">
          <div className="led-indicator active"></div>
          <span className="brand-logo-text">KILAT WORKSTATION</span>
          <span className="hardware-badge">SYS-3.0.0</span>
        </div>
        <div className="header-status">
          <span className="status-label">STATUS:</span>
          <span className="status-value text-green">ONLINE</span>
        </div>
      </header>

      <div className="deck-wrapper">
        <nav className="tactile-navbar">
          <button className={`nav-deck-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <span className="btn-icon">🏠</span>
            <span className="btn-lbl">Home Console</span>
          </button>
          <button className={`nav-deck-btn ${activeTab === 'install' ? 'active' : ''}`} onClick={() => setActiveTab('install')}>
            <span className="btn-icon">📥</span>
            <span className="btn-lbl">Installer Deck</span>
          </button>
          <button className={`nav-deck-btn ${activeTab === 'usage' ? 'active' : ''}`} onClick={() => setActiveTab('usage')}>
            <span className="btn-icon">🛠️</span>
            <span className="btn-lbl">Operation Manual</span>
          </button>
          <button className={`nav-deck-btn ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')}>
            <span className="btn-icon">🔌</span>
            <span className="btn-lbl">API Modules</span>
          </button>
          <button className={`nav-deck-btn ${activeTab === 'changelog' ? 'active' : ''}`} onClick={() => setActiveTab('changelog')}>
            <span className="btn-icon">📜</span>
            <span className="btn-lbl">Changelog Tape</span>
          </button>
          <button className={`nav-deck-btn ${activeTab === 'contributing' ? 'active' : ''}`} onClick={() => setActiveTab('contributing')}>
            <span className="btn-icon">🤝</span>
            <span className="btn-lbl">Lab Manual</span>
          </button>
          <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="nav-deck-btn link-github">
            <span className="btn-icon">🐙</span>
            <span className="btn-lbl">GitHub Core</span>
          </a>
        </nav>

        <main className="main-viewport">
          {activeTab === 'home' && (
            <div className="tab-view home-tab animate-view">
              <div className="hero-board">
                <div className="hero-illustrative">
                  <svg className="svg-illustration" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="25" width="50" height="50" rx="10" stroke="#8b5cf6" strokeWidth="3" fill="#0c0a24" />
                    <circle cx="50" cy="50" r="16" stroke="#06b6d4" strokeWidth="2.5" />
                    <path d="M50 20 L50 30 M50 70 L50 80 M20 50 L30 50 M70 50 L80 50" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M44 44 L54 50 L46 56 L56 62" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="hero-details">
                  <h1 className="hero-flat-title">KILAT RUNTIME</h1>
                  <p className="hero-flat-desc">
                    Mesin eksekusi JavaScript dan TypeScript instan yang dirancang untuk performa hemat daya di Linux dan Termux Android. Tanpa overhead, tanpa beban duplikasi folder dependency.
                  </p>
                </div>
              </div>

              <div className="crt-terminal-section">
                <div className="terminal-bezel">
                  <div className="crt-screen">
                    <div className="crt-header">
                      <div className="led-row">
                        <span className="led-dot red active"></span>
                        <span className="led-dot yellow"></span>
                        <span className="led-dot green active"></span>
                      </div>
                      <span className="crt-title">CONSOLE MONITOR - SIMULATION</span>
                    </div>

                    <div className="crt-body">
                      <div className="editor-side">
                        <div className="tab-selectors">
                          <button className={`editor-tab-btn ${selectedDemo === 'typescript' ? 'active' : ''}`} onClick={() => setSelectedDemo('typescript')}>main.ts</button>
                          <button className={`editor-tab-btn ${selectedDemo === 'fetch' ? 'active' : ''}`} onClick={() => setSelectedDemo('fetch')}>fetch.js</button>
                          <button className={`editor-tab-btn ${selectedDemo === 'shell' ? 'active' : ''}`} onClick={() => setSelectedDemo('shell')}>exec.js</button>
                        </div>
                        <pre className="code-pre">
                          <code>{templates[selectedDemo].code}</code>
                        </pre>
                      </div>

                      <div className="terminal-side">
                        <div className="terminal-controls">
                          <span className="terminal-label">STDOUT</span>
                          <button className="tactile-run-btn" onClick={runCode} disabled={isRunning}>
                            {isRunning ? 'EXECUTING...' : 'RUN PROGRAM'}
                          </button>
                        </div>
                        <div className="terminal-log-output">
                          {terminalLogs.map((line, idx) => (
                            <div key={idx} className={line.startsWith('$') ? 'log-in' : 'log-out'}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="features-tactile-grid">
                <div className="tactile-card">
                  <div className="card-topline">
                    <span className="card-port">PORT_01</span>
                    <span className="status-dot green"></span>
                  </div>
                  <h3>Ringan & Cepat</h3>
                  <p>Inisialisasi interpreter Goja instan kurang dari 2ms, membebaskan CPU dari startup Node.js V8 yang berat.</p>
                </div>

                <div className="tactile-card">
                  <div className="card-topline">
                    <span className="card-port">PORT_02</span>
                    <span className="status-dot violet"></span>
                  </div>
                  <h3>TypeScript Instan</h3>
                  <p>Mengompilasi on-the-fly di memori menggunakan module esbuild internal terintegrasi tanpa berkas perantara.</p>
                </div>

                <div className="tactile-card">
                  <div className="card-topline">
                    <span className="card-port">PORT_03</span>
                    <span className="status-dot cyan"></span>
                  </div>
                  <h3>Global Cache</h3>
                  <p>Mencegah pemborosan memori penyimpanan dengan memetakan seluruh modul NPM ke cache global tunggal.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="tab-view doc-deck animate-view">
              <h2 className="deck-title">Instalasi Hardware Biner</h2>
              <p className="deck-subtitle">Langkah pemasangan biner statis Kilat ke dalam environment Termux atau Linux Anda.</p>

              <div className="tactile-panel">
                <div className="panel-hdr">
                  <span className="panel-num">DEC_01</span>
                  <h3>Metode Otomatis (Rekomendasi)</h3>
                </div>
                <p>Skrip di bawah akan otomatis mendeteksi arsitektur CPU (ARM64, AMD64, ARMv7) dan memasang biner executable yang sesuai.</p>
                <div className="hardware-command-box">
                  <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                  <button className="panel-copy-btn" onClick={() => handleCopy('inst-auto', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                    {copiedMap['inst-auto'] ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              <div className="tactile-panel">
                <div className="panel-hdr">
                  <span className="panel-num">DEC_02</span>
                  <h3>Metode Kompilasi Manual</h3>
                </div>
                <p>Gunakan opsi ini jika Anda ingin melakukan kompilasi lokal langsung dari repositori source code utama (Memerlukan Golang 1.21+ dan Git).</p>
                <div className="hardware-command-box">
                  <code>git clone https://github.com/IHx-cmyk/kilat && cd kilat && go build -o kilat ./cmd/kilat && mv kilat $PREFIX/bin/</code>
                  <button className="panel-copy-btn" onClick={() => handleCopy('inst-manual', 'git clone https://github.com/IHx-cmyk/kilat && cd kilat && go build -o kilat ./cmd/kilat && mv kilat $PREFIX/bin/')}>
                    {copiedMap['inst-manual'] ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="tab-view doc-deck animate-view">
              <h2 className="deck-title">Operation Manual (CLI)</h2>
              <p className="deck-subtitle">Daftar instruksi konsol untuk mengontrol proyek dan runtime.</p>

              <div className="tactile-grid-2">
                <div className="tactile-panel">
                  <div className="panel-hdr">
                    <span className="panel-num">OP_01</span>
                    <h3>Inisialisasi Folder</h3>
                  </div>
                  <p>Membuat file konfigurasi package.json dasar secara interaktif di direktori kerja.</p>
                  <pre className="inline-code"><code>$ kilat init</code></pre>
                </div>

                <div className="tactile-panel">
                  <div className="panel-hdr">
                    <span className="panel-num">OP_02</span>
                    <h3>Eksekusi Skrip</h3>
                  </div>
                  <p>Menjalankan file JavaScript (CommonJS/ESM) atau TypeScript.</p>
                  <pre className="inline-code"><code>$ kilat run index.js</code></pre>
                </div>

                <div className="tactile-panel">
                  <div className="panel-hdr">
                    <span className="panel-num">OP_03</span>
                    <h3>Instalasi Modul NPM</h3>
                  </div>
                  <p>Mengunduh dependensi NPM dan menyimpannya secara terpusat di global cache.</p>
                  <pre className="inline-code"><code>$ kilat add lodash</code></pre>
                </div>

                <div className="tactile-panel">
                  <div className="panel-hdr">
                    <span className="panel-num">OP_04</span>
                    <h3>Auto Watch Mode</h3>
                  </div>
                  <p>Memantau berkas proyek dan melakukan restart runtime otomatis saat terjadi perubahan.</p>
                  <pre className="inline-code"><code>$ kilat run index.ts --watch</code></pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="tab-view doc-deck animate-view">
              <h2 className="deck-title">API & Core Modules</h2>
              <p className="deck-subtitle">Metode standard library bawaan yang dapat langsung diakses di dalam program.</p>

              <div className="tactile-table-wrapper">
                <table className="tactile-table">
                  <thead>
                    <tr>
                      <th>Modul / Metode</th>
                      <th>Tipe Akses</th>
                      <th>Deskripsi Fungsional</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>globalThis.$</code></td>
                      <td>Global API</td>
                      <td>Eksekusi perintah shell linux/termux secara asinkron.</td>
                    </tr>
                    <tr>
                      <td><code>globalThis.fetch</code></td>
                      <td>Global API</td>
                      <td>Melakukan HTTP network request asinkron berbasis standard Promise.</td>
                    </tr>
                    <tr>
                      <td><code>require('fs')</code></td>
                      <td>Core Module</td>
                      <td>Menyediakan operasi filesystem lokal (read, write, readdir, exists).</td>
                    </tr>
                    <tr>
                      <td><code>require('os')</code></td>
                      <td>Core Module</td>
                      <td>Mengambil data environment variable dan CLI parameter input.</td>
                    </tr>
                    <tr>
                      <td><code>Bun.serve</code></td>
                      <td>Global API</td>
                      <td>Membangun HTTP server asinkron internal performa tinggi.</td>
                    </tr>
                    <tr>
                      <td><code>console.log</code></td>
                      <td>Global API</td>
                      <td>Menulis log output berwarna (red, yellow, green, blue).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="tab-view doc-deck animate-view">
              <h2 className="deck-title">Changelog Tape</h2>
              <p className="deck-subtitle">Gulungan pita log riwayat pembaruan hardware biner Kilat.</p>

              <div className="changelog-tape">
                <div className="tape-segment">
                  <div className="tape-hdr">
                    <span className="tape-ver text-violet">v3.0.0</span>
                    <span className="tape-date">11 Juli 2026</span>
                    <span className="tape-badge active">LATEST</span>
                  </div>
                  <p>Memperkenalkan **Shell Command Execution (<code>$</code>)**. Dukungan asinkron penuh menggunakan goroutine untuk mengeksekusi biner eksternal dan CLI utilitas di Termux / Linux.</p>
                </div>

                <div className="tape-segment">
                  <div className="tape-hdr">
                    <span className="tape-ver">v2.1.0</span>
                    <span className="tape-date">11 Juli 2026</span>
                  </div>
                  <p>Memperkenalkan **Global Fetch API (<code>fetch</code>)** yang terintegrasi secara asinkron dengan event-loop untuk pemanggilan API dan transfer data HTTP.</p>
                </div>

                <div className="tape-segment">
                  <div className="tape-hdr">
                    <span className="tape-ver">v2.0.0</span>
                    <span className="tape-date">1 Juli 2026</span>
                  </div>
                  <p>Integrasi compiler **esbuild** internal untuk mendukung pemuatan file **TypeScript (TS, TSX, JSX)** dan transpiler **ES Modules (ESM)** di memori secara otomatis.</p>
                </div>

                <div className="tape-segment">
                  <div className="tape-hdr">
                    <span className="tape-ver">v0.4.0</span>
                    <span className="tape-date">20 Juni 2026</span>
                  </div>
                  <p>Mendukung pembuatan HTTP Server asinkron internal dengan **Bun.serve()**, serta integrasi REPL yang mendukung eksekusi microtasks.</p>
                </div>

                <div className="tape-segment">
                  <div className="tape-hdr">
                    <span className="tape-ver">v0.1.0</span>
                    <span className="tape-date">19 Juni 2026</span>
                  </div>
                  <p>Rilis biner perdana interpreter JavaScript Kilat berbasis Goja Engine dengan modul fundamental (fs, os, console) serta manajemen dependensi global terpusat.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contributing' && (
            <div className="tab-view doc-deck animate-view">
              <h2 className="deck-title">Berkontribusi ke Laboratorium</h2>
              <p className="deck-subtitle">Manual kolaborasi pengembangan runtime Kilat secara lokal.</p>

              <div className="tactile-panel">
                <div className="panel-hdr">
                  <span className="panel-num">LAB_01</span>
                  <h3>Pembangunan Environment Uji Coba</h3>
                </div>
                <p>Silakan lakukan fork proyek ke akun Anda, lalu lakukan kompilasi biner secara lokal untuk memulai pengujian kode:</p>
                <div className="hardware-command-box">
                  <code>git clone https://github.com/IHx-cmyk/kilat && cd kilat && go mod tidy && go build -o kilat ./cmd/kilat</code>
                  <button className="panel-copy-btn" onClick={() => handleCopy('contrib-code', 'git clone https://github.com/IHx-cmyk/kilat && cd kilat && go mod tidy && go build -o kilat ./cmd/kilat')}>
                    {copiedMap['contrib-code'] ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              <div className="tactile-panel">
                <div className="panel-hdr">
                  <span className="panel-num">LAB_02</span>
                  <h3>Pengiriman Perubahan</h3>
                </div>
                <p>Seluruh kontribusi kode dikirimkan melalui Pull Request ke branch <code>main</code>. Pastikan Anda telah merapikan format kode dengan <code>go fmt</code> sebelum dikirimkan.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="portal-footer">
        <p>MIT License © 2026 Kilat. Dibuat seadanya untuk optimasi Termux Android.</p>
      </footer>
    </div>
  )
}
