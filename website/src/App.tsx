import { useState, useEffect } from 'react'

interface PageItem {
  key: string
  title: string
  icon: string
}

const pageOrder: PageItem[] = [
  { key: 'index', title: 'Home', icon: '🏠' },
  { key: 'installation', title: 'Instalasi', icon: '📥' },
  { key: 'usage', title: 'Penggunaan', icon: '🛠️' },
  { key: 'modules', title: 'API & Modules', icon: '🔌' },
  { key: 'changelog', title: 'Changelog', icon: '📜' },
  { key: 'contributing', title: 'Kontribusi', icon: '🤝' }
]

export default function App() {
  const [activePage, setActivePage] = useState<string>('index')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [copiedTextMap, setCopiedTextMap] = useState<Record<string, boolean>>({})
  const [terminalTab, setTerminalTab] = useState<string>('hello')
  const [terminalOutput, setTerminalOutput] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      const match = pageOrder.find(p => p.key === hash)
      if (match) {
        setActivePage(hash)
      } else {
        setActivePage('index')
      }
      setMobileMenuOpen(false)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedTextMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedTextMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  const simulateTerminal = (tab: string) => {
    setTerminalTab(tab)
    setIsTyping(true)
    setTerminalOutput('')
    
    let text = ''
    let outputs: string[] = []

    if (tab === 'hello') {
      text = 'kilat run hello.js'
      outputs = [
        '🚀 Hello from Kilat!',
        'OS: android',
        'Files: [ "hello.js", "package.json" ]'
      ]
    } else if (tab === 'typescript') {
      text = 'kilat run hello.ts'
      outputs = [
        '✨ esbuild transpiled TypeScript...',
        'User: ihsannyy',
        'TypeScript v5.x executing in memory successfully!'
      ]
    } else if (tab === 'fetch') {
      text = 'kilat run api.js'
      outputs = [
        '📡 Fetching https://api.github.com/repos/ihsannyy/kilat...',
        'Status: 200 OK',
        'Repository: kilat (Stars: 12)'
      ]
    } else if (tab === 'shell') {
      text = 'kilat run run-command.js'
      outputs = [
        '⚡ Executing: $`uname -a`',
        'Linux termux-android 4.19.191-android12-9 #1 SMP PREEMPT'
      ]
    }

    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setTerminalOutput(prev => prev + text[i])
        i++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        setTimeout(() => {
          setTerminalOutput(prev => prev + '\n' + outputs.join('\n'))
        }, 150)
      }
    }, 40)
  }

  useEffect(() => {
    simulateTerminal('hello')
  }, [])

  const renderPageContent = () => {
    switch (activePage) {
      case 'index':
        return (
          <div className="home-layout animate-fade-in">
            <div className="hero-section">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                Ditenagai Go + Goja
              </div>
              <h1 className="hero-title">Kilat</h1>
              <p className="hero-subtitle">
                Runtime JavaScript & TypeScript super ringan untuk Termux dan Linux. Jalankan script, instal dependensi NPM — <strong>tanpa node_modules</strong>.
              </p>
              <div className="hero-actions">
                <a href="#installation" className="btn btn-primary">Mulai Instalasi</a>
                <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub</a>
              </div>
            </div>

            <div className="interactive-demo-section">
              <h2 className="demo-section-heading">Coba Interaktif Simulator</h2>
              <p className="demo-section-sub">Klik tab di bawah untuk mensimulasikan berbagai perintah Kilat langsung di browser Anda.</p>
              
              <div className="demo-terminal-wrapper">
                <div className="terminal-tabs">
                  <button className={`terminal-tab ${terminalTab === 'hello' ? 'active' : ''}`} onClick={() => simulateTerminal('hello')}>Hello JS</button>
                  <button className={`terminal-tab ${terminalTab === 'typescript' ? 'active' : ''}`} onClick={() => simulateTerminal('typescript')}>TypeScript</button>
                  <button className={`terminal-tab ${terminalTab === 'fetch' ? 'active' : ''}`} onClick={() => simulateTerminal('fetch')}>Fetch API</button>
                  <button className={`terminal-tab ${terminalTab === 'shell' ? 'active' : ''}`} onClick={() => simulateTerminal('shell')}>Shell Runner ($)</button>
                </div>
                <div className="demo-terminal">
                  <div className="terminal-header">
                    <div className="terminal-dots">
                      <span className="terminal-dot red"></span>
                      <span className="terminal-dot yellow"></span>
                      <span className="terminal-dot green"></span>
                    </div>
                    <span className="terminal-title">~/kilat-simulator</span>
                  </div>
                  <div className="terminal-body">
                    <pre>
                      <code>
                        <span className="sh-prompt">$</span>{terminalOutput}
                        {isTyping && <span className="terminal-cursor"></span>}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Eksekusi Instan</h3>
                <p className="feature-desc">Startup cepat berbasis engine interpreter Goja murni, menghindari beban startup Node V8 pada Android.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3 className="feature-title">Package Manager</h3>
                <p className="feature-desc">Perintah <code>kilat add</code> mengunduh modul NPM langsung ke cache global terpusat.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📁</div>
                <h3 className="feature-title">Tanpa node_modules</h3>
                <p className="feature-desc">Hemat ruang penyimpanan perangkat seluler dengan menghilangkan direktori duplikasi dependensi lokal.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔌</div>
                <h3 className="feature-title">Bawaan API Lengkap</h3>
                <p className="feature-desc">Dilengkapi modul bawaan penting untuk console warna, filesystem, network fetch, dan environment.</p>
              </div>
            </div>

            <div className="install-banner">
              <div className="banner-text">
                <h3>Pasang Sekarang di Termux Anda</h3>
                <p>Cukup jalankan satu perintah instalasi otomatis untuk mulai menggunakan Kilat.</p>
              </div>
              <div className="banner-code-box">
                <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                <button className="btn-copy-banner" onClick={() => handleCopy('inst-banner', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                  {copiedTextMap['inst-banner'] ? 'Copied' : 'Salin'}
                </button>
              </div>
            </div>
          </div>
        )

      case 'installation':
        return (
          <div className="doc-layout animate-fade-in">
            <h1 className="doc-page-title">Instalasi Kilat</h1>
            <p className="doc-page-subtitle">Ikuti langkah-langkah di bawah untuk memasang runtime Kilat di Termux Android atau perangkat Linux.</p>

            <div className="doc-card">
              <h2>Instalasi Otomatis (Sangat Direkomendasikan)</h2>
              <p>Script instalasi resmi akan memindai arsitektur CPU Anda (ARM64, AMD64, atau ARMv7), mengunduh biner rilis statis terbaru, dan meletakkannya langsung ke path bin Anda.</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Shell Command</span>
                  <button onClick={() => handleCopy('inst-auto', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>{copiedTextMap['inst-auto'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Build dari Source Code</h2>
              <p>Apabila Anda ingin menggunakan versi pengembangan terkini atau mengompilasi sendiri secara lokal, Anda dapat melacak kode sumber proyek:</p>
              <ul>
                <li>Pastikan compiler Go terpasang (<code>pkg install golang</code>).</li>
                <li>Pastikan Git terpasang (<code>pkg install git</code>).</li>
              </ul>
              <div className="code-window">
                <div className="window-header">
                  <span>Source Compile</span>
                  <button onClick={() => handleCopy('inst-source', 'git clone https://github.com/IHx-cmyk/kilat\ncd kilat\ngo build -o kilat ./cmd/kilat\nmv kilat $PREFIX/bin/')}>{copiedTextMap['inst-source'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-comment"># Clone repositori</span>{"\n"}<span className="sh-prompt">$</span>git clone https://github.com/IHx-cmyk/kilat{"\n"}<span className="sh-prompt">$</span>cd kilat{"\n"}<span className="sh-comment"># Compile biner runtime</span>{"\n"}<span className="sh-prompt">$</span>go build -o kilat ./cmd/kilat{"\n"}<span className="sh-comment"># Pindahkan ke environment path</span>{"\n"}<span className="sh-prompt">$</span>mv kilat $PREFIX/bin/</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Verifikasi Hasil</h2>
              <p>Gunakan bendera versi untuk memastikan Kilat telah terpasang dengan benar di terminal Anda:</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('inst-verify', 'kilat --version')}>{copiedTextMap['inst-verify'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>kilat --version{"\n"}<span className="sh-out">Kilat v3.0.0</span></code></pre>
              </div>
            </div>
          </div>
        )

      case 'usage':
        return (
          <div className="doc-layout animate-fade-in">
            <h1 className="doc-page-title">Panduan Penggunaan</h1>
            <p className="doc-page-subtitle">Cara mengelola proyek, memasang dependensi, dan menjalankan berkas JavaScript dengan Kilat CLI.</p>

            <div className="doc-card">
              <h2>Memulai Proyek Baru</h2>
              <p>Perintah <code>kilat init</code> digunakan untuk membuat berkas konfigurasi <code>package.json</code> secara interaktif.</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('usage-init', 'kilat init')}>{copiedTextMap['usage-init'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>kilat init{"\n"}<span className="sh-out">? Nama proyek: proyek-saya{"\n"}? Versi: 1.0.0{"\n"}? Entry point: index.js{"\n"}✔ package.json berhasil dibuat!</span></code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Menjalankan Berkas</h2>
              <p>Gunakan perintah <code>kilat run</code> untuk mengeksekusi berkas JavaScript (CJS/ESM) atau TypeScript:</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('usage-run', 'kilat run index.js')}>{copiedTextMap['usage-run'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>kilat run index.js</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Menambahkan Package NPM</h2>
              <p>Gunakan <code>kilat add</code> untuk mengunduh package dari NPM registry global tanpa meletakkannya di folder lokal proyek Anda:</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('usage-add', 'kilat add lodash')}>{copiedTextMap['usage-add'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>kilat add lodash</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Watch Mode (Auto Reload)</h2>
              <p>Gunakan opsi <code>-w</code> atau <code>--watch</code> untuk memantau perubahan berkas dan memuat ulang program secara otomatis:</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('usage-watch', 'kilat run index.js --watch')}>{copiedTextMap['usage-watch'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>kilat run index.js --watch</code></pre>
              </div>
            </div>
          </div>
        )

      case 'modules':
        return (
          <div className="doc-layout animate-fade-in">
            <h1 className="doc-page-title">API & Modul Bawaan</h1>
            <p className="doc-page-subtitle">Modul inti yang terintegrasi secara bawaan di runtime Kilat untuk mempercepat proses pengembangan Anda.</p>

            <div className="doc-card">
              <h2>API Global Baru (Asinkron)</h2>
              <p>Sejak versi 2.1.0 dan 3.0.0, Kilat mendukung API global asinkron yang terintegrasi dengan loop tugas latar belakang:</p>
              <ul>
                <li><strong><code>globalThis.fetch(url, options)</code></strong>: API Fetch standar asinkron untuk melakukan HTTP request.</li>
                <li><strong><code>globalThis.$(command)</code></strong>: Shell executor asinkron. Dapat dipanggil sebagai fungsi atau tag template literal.</li>
              </ul>
              <div className="code-window">
                <div className="window-header">
                  <span>example.js</span>
                  <button onClick={() => handleCopy('api-global', 'async function main() {\n  const res = await fetch("https://api.github.com");\n  const data = await res.json();\n  console.log(data);\n  const out = await $`echo "Platform: $(uname)"`;\n  console.log(out.stdout);\n}\nmain();')}>{copiedTextMap['api-global'] ? 'Disalin!' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-keyword">async</span> <span className="sh-keyword">function</span> <span className="sh-func">main</span>() &#123;{"\n"}  <span className="sh-keyword">const</span> res = <span className="sh-keyword">await</span> <span className="sh-func">fetch</span>(<span className="sh-string">"https://api.github.com"</span>);{"\n"}  <span className="sh-keyword">const</span> data = <span className="sh-keyword">await</span> res.<span className="sh-func">json</span>();{"\n"}  <span className="sh-func">console.log</span>(data);{"\n\n"}  <span className="sh-keyword">const</span> out = <span className="sh-keyword">await</span> $`echo "Platform: $(uname)"`;{"\n"}  <span className="sh-func">console.log</span>(out.stdout);{"\n"}&#125;{"\n"}<span className="sh-func">main</span>();</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Modul Core Standard</h2>
              <div className="table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Modul / Method</th>
                      <th>Deskripsi</th>
                      <th>Contoh Pemanggilan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>require('fs')</code></td>
                      <td>Operasi filesystem secara sinkron (readFileSync, writeFileSync, readdirSync, existsSync).</td>
                      <td><code>const fs = require('fs');</code></td>
                    </tr>
                    <tr>
                      <td><code>require('os')</code></td>
                      <td>Membaca data sistem operasi, lingkungan (getenv), dan parameter CLI (args).</td>
                      <td><code>const os = require('os');</code></td>
                    </tr>
                    <tr>
                      <td><code>console.log()</code></td>
                      <td>Log output berwarna (opsional parameter warna: green, red, yellow, blue).</td>
                      <td><code>console.log('OK', 'green');</code></td>
                    </tr>
                    <tr>
                      <td><code>Bun.serve()</code></td>
                      <td>HTTP Server asinkron built-in berkinerja tinggi.</td>
                      <td><code>Bun.serve(&#123; port: 3000, fetch: ... &#125;);</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'changelog':
        return (
          <div className="doc-layout animate-fade-in">
            <h1 className="doc-page-title">Riwayat Rilis</h1>
            <p className="doc-page-subtitle">Daftar perubahan bertahap dan rilis berkala biner runtime Kilat.</p>

            <div className="timeline-container">
              <div className="timeline-node">
                <div className="node-marker active"></div>
                <div className="node-content">
                  <div className="node-header">
                    <h3>v3.0.0</h3>
                    <span className="node-date">11 Juli 2026</span>
                    <span className="node-tag latest">Terbaru</span>
                  </div>
                  <p>Memperkenalkan **Global Shell Command Execution (<code>$</code>)**. Dukungan asinkron penuh menggunakan goroutine untuk mengeksekusi biner eksternal dan CLI utilitas di Termux / Linux.</p>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-marker"></div>
                <div className="node-content">
                  <div className="node-header">
                    <h3>v2.1.0</h3>
                    <span className="node-date">11 Juli 2026</span>
                  </div>
                  <p>Memperkenalkan **Global Fetch API (<code>fetch</code>)** yang terintegrasi secara asinkron dengan event-loop untuk pemanggilan API dan transfer data HTTP.</p>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-marker"></div>
                <div className="node-content">
                  <div className="node-header">
                    <h3>v2.0.0</h3>
                    <span className="node-date">1 Juli 2026</span>
                  </div>
                  <p>Integrasi compiler **esbuild** internal untuk mendukung pemuatan file **TypeScript (TS, TSX, JSX)** dan transpiler **ES Modules (ESM)** di memori secara otomatis.</p>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-marker"></div>
                <div className="node-content">
                  <div className="node-header">
                    <h3>v0.4.0</h3>
                    <span className="node-date">20 Juni 2026</span>
                  </div>
                  <p>Mendukung pembuatan HTTP Server asinkron internal dengan **Bun.serve()**, serta integrasi REPL yang mendukung eksekusi microtasks.</p>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-marker"></div>
                <div className="node-content">
                  <div className="node-header">
                    <h3>v0.1.0</h3>
                    <span className="node-date">19 Juni 2026</span>
                  </div>
                  <p>Rilis biner perdana interpreter JavaScript Kilat berbasis Goja Engine dengan modul fundamental (fs, os, console) serta manajemen dependensi global terpusat.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contributing':
        return (
          <div className="doc-layout animate-fade-in">
            <h1 className="doc-page-title">Berkontribusi ke Kilat</h1>
            <p className="doc-page-subtitle">Cara berpartisipasi membesarkan proyek Kilat agar menjadi semakin andal dan cepat.</p>

            <div className="doc-card">
              <h2>Panduan Memulai Cepat</h2>
              <p>Kami sangat menyambut kontribusi kode, pelaporan bug, dan perbaikan dokumentasi. Anda dapat mengompilasi biner secara lokal dari fork repositori Anda:</p>
              <div className="code-window">
                <div className="window-header">
                  <span>Terminal</span>
                  <button onClick={() => handleCopy('contrib-code', 'git clone https://github.com/IHx-cmyk/kilat\ncd kilat\ngo mod tidy\ngo build -o kilat ./cmd/kilat')}>{copiedTextMap['contrib-code'] ? 'Salin' : 'Salin'}</button>
                </div>
                <pre><code><span className="sh-prompt">$</span>git clone https://github.com/IHx-cmyk/kilat{"\n"}<span className="sh-prompt">$</span>cd kilat{"\n"}<span className="sh-prompt">$</span>go mod tidy{"\n"}<span className="sh-prompt">$</span>go build -o kilat ./cmd/kilat</code></pre>
              </div>
            </div>

            <div className="doc-card">
              <h2>Lisensi Proyek</h2>
              <p>Kilat dirilis sebagai perangkat lunak open-source berlisensi <strong>MIT License</strong>. Anda bebas menggunakan, memodifikasi, dan membagikannya secara gratis sesuai syarat atribusi.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="app-container">
      <div className="glow-mesh glow-1"></div>
      <div className="glow-mesh glow-2"></div>
      <div className="cyber-grid"></div>

      <nav className="glass-navbar">
        <div className="navbar-inner">
          <a href="#index" className="brand-logo">
            <span className="logo-spark">⚡</span> kilat <span className="logo-version">v3.0.0</span>
          </a>
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div className={`drawer-nav ${mobileMenuOpen ? 'open' : ''}`}>
        {pageOrder.map(page => (
          <a key={page.key} href={`#${page.key}`} className={`drawer-link ${activePage === page.key ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <span className="drawer-icon">{page.icon}</span> {page.title}
          </a>
        ))}
        <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="drawer-link">
          <span className="drawer-icon">🐙</span> GitHub
        </a>
      </div>

      <div className="layout-body">
        <aside className="glass-sidebar">
          <div className="sidebar-brand">
            <span className="logo-spark">⚡</span> kilat <span className="logo-version">v3.0.0</span>
          </div>
          <nav className="sidebar-menu">
            {pageOrder.map(page => (
              <a key={page.key} href={`#${page.key}`} className={`menu-item ${activePage === page.key ? 'active' : ''}`}>
                <span className="menu-icon">{page.icon}</span>
                <span className="menu-text">{page.title}</span>
              </a>
            ))}
            <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="menu-item-github">
              🐙 GitHub
            </a>
          </nav>
        </aside>

        <main className="main-content">
          <div className="page-wrapper">
            {activePage !== 'index' && (
              <div className="terminal-breadcrumbs">
                <span className="breadcrumb-path">docs/{activePage}.js</span>
              </div>
            )}
            
            {renderPageContent()}

            <footer className="glass-footer">
              <p>Dibuat seadanya. Modal sebatang rokok & segelintir harapan user Termux.</p>
              <p>MIT License © 2026 Kilat.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
