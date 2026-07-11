import { useState, useEffect, useRef } from 'react'

interface PageItem {
  key: string
  title: string
  icon: string
}

const pages: PageItem[] = [
  { key: 'home', title: 'Dashboard', icon: '⚡' },
  { key: 'install', title: 'Instalasi', icon: '📥' },
  { key: 'api', title: 'API Referensi', icon: '🔌' },
  { key: 'changelog', title: 'Changelog', icon: '📜' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})
  const [timeMode, setTimeMode] = useState<string>('MALAM')
  const [clockText, setClockText] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

    const maxDrops = 100
    const rain: Array<{ x: number; y: number; speed: number; len: number }> = []
    for (let i = 0; i < maxDrops; i++) {
      rain.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 12 + Math.random() * 8,
        len: 12 + Math.random() * 12
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
      flash = 0.55
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      if (timeMode === 'PAGI') {
        grad.addColorStop(0, '#0f0e21')
        grad.addColorStop(1, '#ae5231')
      } else if (timeMode === 'SIANG') {
        grad.addColorStop(0, '#191b26')
        grad.addColorStop(1, '#4e5669')
      } else if (timeMode === 'SORE') {
        grad.addColorStop(0, '#1b1429')
        grad.addColorStop(1, '#612551')
      } else {
        grad.addColorStop(0, '#020108')
        grad.addColorStop(1, '#0a0621')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      if (flash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash})`
        ctx.fillRect(0, 0, w, h)

        ctx.strokeStyle = `rgba(255, 255, 255, ${flash + 0.4})`
        ctx.lineWidth = 3
        ctx.beginPath()
        bolt.forEach(s => {
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
        })
        ctx.stroke()

        flash -= 0.04
      }

      if (Math.random() < 0.006 && flash <= 0) {
        buildLightning()
      }

      ctx.strokeStyle = 'rgba(174, 194, 224, 0.28)'
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
            <span className="spark">⚡</span>
            <span className="name">kilat</span>
            <span className="badge">v3.0.0</span>
          </div>
          <div className="environment-clock">
            <span className="clock-icon">🌦️</span>
            <span className="time-lbl">MODE: {timeMode}</span>
            <span className="time-val">[{clockText}]</span>
          </div>
        </div>
      </header>

      <main className="main-portal-content">
        <nav className="glass-tabs">
          {pages.map(p => (
            <button key={p.key} className={`tab-link ${activeTab === p.key ? 'active' : ''}`} onClick={() => setActiveTab(p.key)}>
              <span className="tab-icon">{p.icon}</span>
              <span className="tab-text">{p.title}</span>
            </button>
          ))}
          <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="tab-link link-github">
            <span className="tab-icon">🐙</span>
            <span className="tab-text">GitHub</span>
          </a>
        </nav>

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
                    <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
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
                    <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
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
                    <code>kilat --version</code>
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
