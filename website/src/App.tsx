import { useState } from 'react'

interface Benchmark {
  label: string
  metric: string
  kilatSegments: number
  nodeSegments: number
  higherIsBetter: boolean
}

const benchmarks: Benchmark[] = [
  {
    label: 'React SSR (Requests / sec)',
    metric: 'req/sec',
    kilatSegments: 9,
    nodeSegments: 2,
    higherIsBetter: true
  },
  {
    label: 'File Reading Startup (ms)',
    metric: 'ms',
    kilatSegments: 1,
    nodeSegments: 7,
    higherIsBetter: false
  },
  {
    label: 'Package Install Speed (s)',
    metric: 'sec',
    kilatSegments: 2,
    nodeSegments: 8,
    higherIsBetter: false
  }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  return (
    <div className="hardware-station">
      <div className="ambient-glow purple-glow"></div>
      <div className="ambient-glow cyan-glow"></div>
      <div className="crt-scanlines"></div>

      <header className="station-header">
        <div className="header-brand">
          <div className="status-led green pulse"></div>
          <span className="station-logo">KILAT</span>
          <span className="station-ver">v3.0.0</span>
        </div>
        <nav className="station-nav-tabs">
          <button className={`station-tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home Console</button>
          <button className={`station-tab-btn ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>API Deck</button>
          <button className={`station-tab-btn ${activeTab === 'changelog' ? 'active' : ''}`} onClick={() => setActiveTab('changelog')}>Changelog Tape</button>
        </nav>
        <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="header-github">GitHub</a>
      </header>

      <main className="station-body">
        {activeTab === 'home' && (
          <div className="home-view animate-fade">
            <section className="hero-section">
              <h1 className="hero-title">Kilat is a fast, all-in-one JS & TS runtime</h1>
              <p className="hero-subtitle">
                Dirancang khusus untuk mengoptimalkan Termux Android dan Linux. Kilat meniadakan folder <code>node_modules</code> lokal, mendukung TypeScript bawaan, dan memulai program secara instan dalam 2ms.
              </p>
              
              <div className="skeuo-install-box">
                <div className="install-header">
                  <div className="bezel-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="install-title">INSTALLATION CHANNEL</span>
                </div>
                <div className="install-body">
                  <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                  <button className="copy-bezel-btn" onClick={() => handleCopy('hero-inst', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                    {copiedMap['hero-inst'] ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </section>

            <section className="benchmark-section">
              <div className="section-titlebar">
                <h2>HARDWARE SPEED VU METERS</h2>
                <p>Pengukuran beban komparatif Kilat terhadap Node.js. Menampilkan performa level LED fisik.</p>
              </div>

              <div className="vu-meters-container">
                {benchmarks.map((bench, idx) => (
                  <div key={idx} className="vu-card">
                    <h3 className="vu-label">{bench.label}</h3>
                    
                    <div className="vu-row">
                      <div className="vu-device-name">KILAT</div>
                      <div className="led-bar">
                        {Array.from({ length: 10 }).map((_, i) => {
                          const isLit = i < bench.kilatSegments
                          let colorClass = 'green'
                          if (i >= 7) colorClass = 'red'
                          else if (i >= 5) colorClass = 'yellow'
                          return <span key={i} className={`led-seg ${colorClass} ${isLit ? 'on' : ''}`}></span>
                        })}
                      </div>
                      <div className="vu-value text-cyan">{bench.higherIsBetter && bench.kilatSegments === 9 ? 'FAST' : 'EFFICIENT'}</div>
                    </div>

                    <div className="vu-row">
                      <div className="vu-device-name">NODE.JS</div>
                      <div className="led-bar">
                        {Array.from({ length: 10 }).map((_, i) => {
                          const isLit = i < bench.nodeSegments
                          let colorClass = 'green'
                          if (i >= 7) colorClass = 'red'
                          else if (i >= 5) colorClass = 'yellow'
                          return <span key={i} className={`led-seg ${colorClass} ${isLit ? 'on' : ''}`}></span>
                        })}
                      </div>
                      <div className="vu-value text-red">{!bench.higherIsBetter && bench.nodeSegments === 8 ? 'SLOW' : 'LAGGING'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="features-rack">
              <div className="section-titlebar">
                <h2>RACK-MOUNTED RUNTIME MODULES</h2>
                <p>Bagian-bagian kemampuan bawaan runtime Kilat yang tersusun dalam modul rak perangkat keras.</p>
              </div>

              <div className="rack-modules-list">
                <div className="rack-module">
                  <div className="rack-faceplate">
                    <div className="rack-handle"></div>
                    <div className="rack-info">
                      <h3>01. PACKAGE MANAGER (<code>kilat add</code>)</h3>
                      <p>Mengunduh module langsung dari npm registry ke dalam cache global terpusat di <code>~/.kilat/packages/</code>. Folder proyek Anda tidak akan memakan memori penyimpanan internal Termux.</p>
                    </div>
                    <div className="rack-handle"></div>
                  </div>
                  <div className="rack-display">
                    <pre><code><span className="sh-prompt">$</span>kilat add chalk{"\n"}<span className="sh-out">📦 Fetching chalk from npm...{"\n"}✔ Installed chalk (global cache)</span></code></pre>
                  </div>
                </div>

                <div className="rack-module">
                  <div className="rack-faceplate">
                    <div className="rack-handle"></div>
                    <div className="rack-info">
                      <h3>02. TYPESCRIPT COMPILER (esbuild)</h3>
                      <p>Mendukung eksekusi file <code>.ts</code>, <code>.tsx</code>, dan <code>.jsx</code> secara langsung. Compiler esbuild internal melakukan transpiling langsung di memori saat runtime dipanggil.</p>
                    </div>
                    <div className="rack-handle"></div>
                  </div>
                  <div className="rack-display">
                    <pre><code><span className="sh-comment">// run directly: kilat run hello.ts</span>{"\n"}<span className="sh-keyword">const</span> x: <span className="sh-keyword">string</span> = <span className="sh-string">'Kilat TS'</span>;{"\n"}<span className="sh-func">console.log</span>(x);</code></pre>
                  </div>
                </div>

                <div className="rack-module">
                  <div className="rack-faceplate">
                    <div className="rack-handle"></div>
                    <div className="rack-info">
                      <h3>03. SHELL RUNNER (<code>globalThis.$</code>)</h3>
                      <p>Memanggil utilitas terminal Linux/Termux asli secara asinkron dari JavaScript. Menggunakan interface Go goroutine di latar belakang untuk mendapatkan hasil command stdout/stderr.</p>
                    </div>
                    <div className="rack-handle"></div>
                  </div>
                  <div className="rack-display">
                    <pre><code><span className="sh-keyword">const</span> sys = <span className="sh-keyword">await</span> $`uname -a`;{"\n"}<span className="sh-func">console.log</span>(sys.stdout);</code></pre>
                  </div>
                </div>

                <div className="rack-module">
                  <div className="rack-faceplate">
                    <div className="rack-handle"></div>
                    <div className="rack-info">
                      <h3>04. HTTP SERVER (<code>Bun.serve</code>)</h3>
                      <p>Inisialisasi HTTP server berkinerja tinggi. Didukung adapter asinkron Go net/http untuk throughput maksimal di perangkat mobile Android.</p>
                    </div>
                    <div className="rack-handle"></div>
                  </div>
                  <div className="rack-display">
                    <pre><code>Bun.serve(&#123;{"\n"}  port: 3000,{"\n"}  fetch(req) &#123; return new Response('OK'); &#125;{"\n"}&#125;);</code></pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="api-view animate-fade">
            <div className="section-titlebar">
              <h2>API OPERATIONS MANUAL</h2>
              <p>Metode library bawaan runtime Kilat yang siap dieksekusi.</p>
            </div>

            <div className="hardware-panel-grid">
              <div className="panel-slot">
                <div className="slot-hdr">
                  <span className="slot-id">API_01</span>
                  <h3>globalThis.$</h3>
                </div>
                <p>Menjalankan biner Linux secara langsung dan asinkron.</p>
                <pre><code>const out = await $`ls -la`;</code></pre>
              </div>

              <div className="panel-slot">
                <div className="slot-id">API_02</div>
                <div className="slot-hdr">
                  <h3>globalThis.fetch</h3>
                </div>
                <p>HTTP request asinkron berbasis Promise untuk transfer data.</p>
                <pre><code>const res = await fetch(url);</code></pre>
              </div>

              <div className="panel-slot">
                <div className="slot-hdr">
                  <span className="slot-id">API_03</span>
                  <h3>require('fs')</h3>
                </div>
                <p>Operasi filesystem lokal (readFileSync, writeFileSync, readdirSync, existsSync).</p>
                <pre><code>const content = fs.readFileSync('x.txt');</code></pre>
              </div>

              <div className="panel-slot">
                <div className="slot-hdr">
                  <span className="slot-id">API_04</span>
                  <h3>require('os')</h3>
                </div>
                <p>Akses environment variable (getenv) dan argument CLI (args).</p>
                <pre><code>const args = os.args();</code></pre>
              </div>

              <div className="panel-slot">
                <div className="slot-hdr">
                  <span className="slot-id">API_05</span>
                  <h3>Bun.serve</h3>
                </div>
                <p>Menjalankan HTTP API server asinkron performa tinggi.</p>
                <pre><code>Bun.serve(&#123; port: 3000, fetch: ... &#125;);</code></pre>
              </div>

              <div className="panel-slot">
                <div className="slot-hdr">
                  <span className="slot-id">API_06</span>
                  <h3>console.log</h3>
                </div>
                <p>Mencetak output berwarna (green, red, yellow, blue).</p>
                <pre><code>console.log('Done', 'green');</code></pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="changelog-view animate-fade">
            <div className="section-titlebar">
              <h2>RELEASE CHANGELOG TAPE</h2>
              <p>Gulungan catatan pembaruan versi biner statis Kilat.</p>
            </div>

            <div className="changelog-hardware-tape">
              <div className="tape-block">
                <div className="tape-block-hdr">
                  <span className="ver-badge">v3.0.0</span>
                  <span className="ver-date">11 Juli 2026</span>
                  <span className="ver-status-led green"></span>
                </div>
                <p>Memperkenalkan **Global Shell Command Execution (<code>$</code>)**. Dukungan asinkron penuh menggunakan goroutine untuk mengeksekusi biner eksternal dan CLI utilitas di Termux / Linux.</p>
              </div>

              <div className="tape-block">
                <div className="tape-block-hdr">
                  <span className="ver-badge">v2.1.0</span>
                  <span className="ver-date">11 Juli 2026</span>
                  <span className="ver-status-led"></span>
                </div>
                <p>Memperkenalkan **Global Fetch API (<code>fetch</code>)** yang terintegrasi secara asinkron dengan event-loop untuk pemanggilan API dan transfer data HTTP.</p>
              </div>

              <div className="tape-block">
                <div className="tape-block-hdr">
                  <span className="ver-badge">v2.0.0</span>
                  <span className="ver-date">1 Juli 2026</span>
                  <span className="ver-status-led"></span>
                </div>
                <p>Integrasi compiler **esbuild** internal untuk mendukung pemuatan file **TypeScript (TS, TSX, JSX)** dan transpiler **ES Modules (ESM)** di memori secara otomatis.</p>
              </div>

              <div className="tape-block">
                <div className="tape-block-hdr">
                  <span className="ver-badge">v0.4.0</span>
                  <span className="ver-date">20 Juni 2026</span>
                  <span className="ver-status-led"></span>
                </div>
                <p>Mendukung pembuatan HTTP Server asinkron internal dengan **Bun.serve()**, serta integrasi REPL yang mendukung eksekusi microtasks.</p>
              </div>

              <div className="tape-block">
                <div className="tape-block-hdr">
                  <span className="ver-badge">v0.1.0</span>
                  <span className="ver-date">19 Juni 2026</span>
                  <span className="ver-status-led"></span>
                </div>
                <p>Rilis biner perdana interpreter JavaScript Kilat berbasis Goja Engine dengan modul fundamental (fs, os, console) serta manajemen dependensi global terpusat.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="station-footer">
        <p>MIT License © 2026 Kilat. Dibuat seadanya untuk optimasi Termux Android.</p>
      </footer>
    </div>
  )
}
