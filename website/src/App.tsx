import React, { useState, useEffect, useRef } from 'react'

interface PageItem {
  key: string
  title: string
  icon: React.ReactNode
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})
  const [timeMode, setTimeMode] = useState<string>('MALAM')
  const [clockText, setClockText] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const pages: PageItem[] = [
    {
      key: 'home',
      title: 'Dashboard',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      key: 'install',
      title: 'Instalasi',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    },
    {
      key: 'api',
      title: 'API Referensi',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      )
    },
    {
      key: 'changelog',
      title: 'Changelog',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    }
  ]

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hrs = now.getHours()
      const mins = String(now.getMinutes()).padStart(2, '0')
      setClockText(`${String(hrs).padStart(2, '0')}:${mins}`)

      if (hrs >= 5 && hrs < 11) {
        setTimeMode('PAGI')
      } else if (hrs >= 11 && hrs < 15) {
        setTimeMode('SIANG')
      } else if (hrs >= 15 && hrs < 18) {
        setTimeMode('SORE')
      } else {
        setTimeMode('MALAM')
      }
    }
    
    updateTime()
    const timeTimer = setInterval(updateTime, 10000)
    return () => clearInterval(timeTimer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const maxDrops = 120
    const rain: Array<{ x: number; y: number; speed: number; len: number }> = []
    for (let i = 0; i < maxDrops; i++) {
      rain.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 14 + Math.random() * 8,
        len: 15 + Math.random() * 12
      })
    }

    let flash = 0
    let bolt: Array<{ x1: number; y1: number; x2: number; y2: number }> = []

    const buildLightning = () => {
      const segs = []
      let cx = Math.random() * w
      let cy = 0
      for (let i = 0; i < 18; i++) {
        const ny = cy + (h / 18) + Math.random() * 15
        const nx = cx + (Math.random() - 0.5) * 35
        segs.push({ x1: cx, y1: cy, x2: nx, y2: ny })
        cx = nx
        cy = ny
        if (ny >= h) break
      }
      bolt = segs
      flash = 0.6
    }

    const drawSilhouettes = () => {
      ctx.fillStyle = 'rgba(8, 7, 24, 0.4)'
      ctx.beginPath()
      ctx.rect(0, h - 150, w * 0.15, 150)
      ctx.rect(w * 0.15, h - 200, w * 0.12, 200)
      ctx.rect(w * 0.32, h - 170, w * 0.14, 170)
      ctx.rect(w * 0.5, h - 230, w * 0.1, 230)
      ctx.rect(w * 0.65, h - 130, w * 0.12, 130)
      ctx.rect(w * 0.8, h - 180, w * 0.15, 180)
      ctx.fill()

      const houseW = 180
      const houseH = 110
      const houseX = w - houseW - 60
      const houseY = h - houseH - 120

      ctx.fillStyle = '#020108'
      ctx.beginPath()
      ctx.arc(w - 120, h - 10, 220, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.rect(0, h - 60, w, 60)
      ctx.fill()

      ctx.fillStyle = '#060416'
      ctx.fillRect(houseX, houseY, houseW, houseH)

      ctx.fillStyle = '#03020a'
      ctx.beginPath()
      ctx.moveTo(houseX - 15, houseY)
      ctx.lineTo(houseX + houseW / 2, houseY - 45)
      ctx.lineTo(houseX + houseW + 15, houseY)
      ctx.closePath()
      ctx.fill()

      ctx.fillRect(houseX + 24, houseY - 40, 18, 30)

      ctx.fillStyle = '#020108'
      ctx.fillRect(houseX + houseW / 2 - 16, houseY + houseH - 50, 32, 50)

      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)'
      ctx.shadowColor = '#ffea79'
      ctx.shadowBlur = 32
      ctx.fillRect(houseX + 28, houseY + 28, 26, 26)
      ctx.fillRect(houseX + houseW - 54, houseY + 28, 26, 26)
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#060416'
      ctx.lineWidth = 2
      ctx.strokeRect(houseX + 28, houseY + 28, 26, 26)
      ctx.beginPath()
      ctx.moveTo(houseX + 41, houseY + 28)
      ctx.lineTo(houseX + 41, houseY + 54)
      ctx.moveTo(houseX + 28, houseY + 41)
      ctx.lineTo(houseX + 54, houseY + 41)
      ctx.stroke()

      ctx.strokeRect(houseX + houseW - 54, houseY + 28, 26, 26)
      ctx.beginPath()
      ctx.moveTo(houseX + houseW - 41, houseY + 28)
      ctx.lineTo(houseX + houseW - 41, houseY + 54)
      ctx.moveTo(houseX + houseW - 54, houseY + 41)
      ctx.lineTo(houseX + houseW - 28, houseY + 41)
      ctx.stroke()
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      if (timeMode === 'PAGI') {
        grad.addColorStop(0, '#0c0b1d')
        grad.addColorStop(1, '#a64f2e')
      } else if (timeMode === 'SIANG') {
        grad.addColorStop(0, '#171822')
        grad.addColorStop(1, '#484f61')
      } else if (timeMode === 'SORE') {
        grad.addColorStop(0, '#191225')
        grad.addColorStop(1, '#5b224c')
      } else {
        grad.addColorStop(0, '#010106')
        grad.addColorStop(1, '#08051c')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      if (flash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash})`
        ctx.fillRect(0, 0, w, h)

        ctx.strokeStyle = `rgba(255, 255, 255, ${flash + 0.45})`
        ctx.lineWidth = 3
        ctx.beginPath()
        bolt.forEach(s => {
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
        })
        ctx.stroke()

        flash -= 0.05
      }

      if (Math.random() < 0.007 && flash <= 0) {
        buildLightning()
      }

      drawSilhouettes()

      ctx.strokeStyle = 'rgba(174, 194, 224, 0.32)'
      ctx.lineWidth = 1
      for (let i = 0; i < maxDrops; i++) {
        const d = rain[i]
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - 1, d.y + d.len)
        ctx.stroke()

        d.y += d.speed
        d.x -= 0.5
        if (d.y > h) {
          d.y = -d.len
          d.x = Math.random() * w
        }
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [timeMode])

  return (
    <div className="weather-runtime-portal">
      <canvas ref={canvasRef} className="storm-backdrop" />

      <header className="glass-navbar">
        <div className="navbar-inner">
          <div className="brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spark-svg">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="name">kilat</span>
            <span className="badge">v3.0.0</span>
          </div>

          <nav className="navbar-links desktop-only">
            {pages.map(p => (
              <button key={p.key} className={`nav-tab-btn ${activeTab === p.key ? 'active' : ''}`} onClick={() => setActiveTab(p.key)}>
                {p.title}
              </button>
            ))}
          </nav>

          <div className="navbar-actions">
            <div className="environment-clock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="clock-svg">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="time-lbl">MODE:&nbsp;</span>
              <span className="time-mode-name">{timeMode}</span>
              <span className="time-val">&nbsp;[{clockText}]</span>
            </div>
            
            <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="btn-github-link" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>

            <button className="menu-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
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
        </div>
      </header>

      <div className={`drawer-nav ${mobileMenuOpen ? 'open' : ''}`}>
        {pages.map(p => (
          <button key={p.key} className={`drawer-link ${activeTab === p.key ? 'active' : ''}`} onClick={() => { setActiveTab(p.key); setMobileMenuOpen(false); }}>
            <span className="tab-icon-svg">{p.icon}</span>
            <span className="drawer-lbl">{p.title}</span>
          </button>
        ))}
        <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
          <span className="tab-icon-svg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </span>
          <span className="drawer-lbl">GitHub</span>
        </a>
      </div>

      <main className="main-portal-content">
        <div className="portal-page-pane">
          {activeTab === 'home' && (
            <div className="pane-view animate-in">
              <section className="portal-hero">
                <h1 className="hero-heading">Supercharge JavaScript & TypeScript on Termux</h1>
                <p className="hero-lead">
                  Kilat adalah runtime minimalis bertenaga Go untuk eksekusi script kilat di perangkat seluler. Tanpa beban direktori <code>node_modules</code>, memuat instan, dan siap pakai.
                </p>

                <div className="terminal-install-box">
                  <div className="box-hdr">
                    <div className="leds">
                      <span className="led red"></span>
                      <span className="led yellow"></span>
                      <span className="led green"></span>
                    </div>
                    <span className="box-title">installer channel</span>
                  </div>
                  <div className="box-body">
                    <div className="code-scroll-wrapper">
                      <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                    </div>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('hero-inst', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                      {copiedMap['hero-inst'] ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              </section>

              <section className="features-glass-grid">
                <div className="glass-card">
                  <div className="card-badge">ENGINE</div>
                  <h3>Ringan & Kencang</h3>
                  <p>Inisialisasi engine Goja yang sangat cepat (~2ms), membebaskan RAM Termux dari overhead V8 Node.js.</p>
                </div>

                <div className="glass-card">
                  <div className="card-badge">COMPILER</div>
                  <h3>TypeScript Bawaan</h3>
                  <p>Dukungan instan untuk berkas <code>.ts</code>, <code>.tsx</code>, dan <code>.jsx</code> via esbuild memori tanpa transpiler eksternal.</p>
                </div>

                <div className="glass-card">
                  <div className="card-badge">CACHE</div>
                  <h3>Bebas node_modules</h3>
                  <p>Dependency dipetakan langsung ke cache global tunggal untuk menghemat penyimpanan disk internal HP.</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">Instalasi Runtime</h2>
              <p className="pane-subtitle">Panduan pemasangan biner statis Kilat di perangkat Anda.</p>

              <div className="glass-panel">
                <h3>1. Instalasi Skrip Otomatis</h3>
                <p>Mendeteksi arsitektur CPU dan memasang biner secara otomatis:</p>
                <div className="terminal-install-box">
                  <div className="box-hdr">
                    <div className="leds">
                      <span className="led"></span>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="code-scroll-wrapper">
                      <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                    </div>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('inst-auto', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                      {copiedMap['inst-auto'] ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel">
                <h3>2. Verifikasi Pemasangan</h3>
                <p>Jalankan perintah ini untuk memastikan biner Kilat aktif:</p>
                <div className="terminal-install-box">
                  <div className="box-hdr">
                    <div className="leds">
                      <span className="led"></span>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="code-scroll-wrapper">
                      <code>kilat --version</code>
                    </div>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('inst-verify', 'kilat --version')}>
                      {copiedMap['inst-verify'] ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">API Referensi</h2>
              <p className="pane-subtitle">Daftar global API dan core module built-in bawaan Kilat.</p>

              <div className="api-panel-grid">
                <div className="api-panel">
                  <h3>globalThis.$</h3>
                  <p>Mengeksekusi perintah shell linux/termux secara asinkron.</p>
                  <pre><code>const out = await $`uname -a`;</code></pre>
                </div>

                <div className="api-panel">
                  <h3>globalThis.fetch</h3>
                  <p>Melakukan network request asinkron berbasis standard Promise.</p>
                  <pre><code>const res = await fetch(url);</code></pre>
                </div>

                <div className="api-panel">
                  <h3>require('fs')</h3>
                  <p>Menyediakan operasi filesystem sinkron (readFileSync, writeFileSync).</p>
                  <pre><code>fs.writeFileSync('log.txt', 'OK');</code></pre>
                </div>

                <div className="api-panel">
                  <h3>require('os')</h3>
                  <p>Mengambil data parameter CLI dan variabel lingkungan (getenv).</p>
                  <pre><code>const user = os.getenv('USER');</code></pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">Release Changelog</h2>
              <p className="pane-subtitle">Riwayat pembaruan biner statis Kilat.</p>

              <div className="changelog-timeline">
                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v3.0.0</span>
                    <span className="date">11 Juli 2026</span>
                    <span className="led green active"></span>
                  </div>
                  <p>Rilis major ini memperkenalkan **Global Shell Command Execution (<code>$</code>)**. Dukungan asinkron penuh menggunakan goroutine untuk mengeksekusi biner eksternal dan CLI utilitas di Termux / Linux.</p>
                </div>

                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v2.1.0</span>
                    <span className="date">11 Juli 2026</span>
                  </div>
                  <p>Rilis minor ini memperkenalkan **Global Fetch API (<code>fetch</code>)** yang terintegrasi secara asinkron dengan event-loop untuk pemanggilan API dan transfer data HTTP.</p>
                </div>

                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v2.0.0</span>
                    <span className="date">1 Juli 2026</span>
                  </div>
                  <p>Integrasi compiler **esbuild** internal untuk mendukung pemuatan file **TypeScript (TS, TSX, JSX)** dan transpiler **ES Modules (ESM)** di memori secara otomatis.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="portal-footer">
        <p>MIT License © 2026 Kilat. Dibuat seadanya untuk optimasi Termux Android.</p>
      </footer>
    </div>
  )
}
