import { useState, useEffect } from 'react'

interface CodeTemplate {
  name: string
  lang: string
  code: string
  output: string[]
}

const templates: Record<string, CodeTemplate> = {
  typescript: {
    name: '01_hello.ts',
    lang: 'typescript',
    code: `const greet = (name: string): string => {
  return \`⚡ Hello \${name}, welcome to Kilat!\`;
};

console.log(greet('Developer'));
console.log('OS Platform:', os.getenv('OSTYPE') || 'linux');`,
    output: [
      '✨ transpiling hello.ts on-the-fly via esbuild...',
      '⚡ Hello Developer, welcome to Kilat!',
      'OS Platform: android'
    ]
  },
  fetch: {
    name: '02_api.js',
    lang: 'javascript',
    code: `async function checkUpdates() {
  console.log('📡 Fetching latest releases...');
  const res = await fetch('https://api.github.com/repos/ihsannyy/kilat/releases/latest');
  const data = await res.json();
  console.log(\`📦 Current Version: \${data.tag_name}\`, 'green');
}

checkUpdates();`,
    output: [
      '📡 Fetching latest releases...',
      '📦 Current Version: v3.0.0'
    ]
  },
  shell: {
    name: '03_cmd.js',
    lang: 'javascript',
    code: `async function checkSystem() {
  console.log('⚡ Querying terminal information...');
  const result = await $\`uname -a\`;
  console.log(\`💻 Kernel: \${result.stdout.trim()}\`);
}

checkSystem();`,
    output: [
      '⚡ Querying terminal information...',
      '💻 Kernel: Linux termux-android 4.19.191-android12-9 #1 SMP PREEMPT'
    ]
  },
  server: {
    name: '04_server.js',
    lang: 'javascript',
    code: `Bun.serve({
  port: 8080,
  fetch(req) {
    console.log(\`📥 Request: \${req.url}\`);
    return new Response('⚡ Kilat HTTP Server is online!');
  }
});

console.log('🚀 Server started on port 8080', 'green');`,
    output: [
      '🚀 Server started on port 8080',
      '📥 Request: http://localhost:8080/',
      '📥 Request: http://localhost:8080/favicon.ico'
    ]
  }
}

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('typescript')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [copiedTextMap, setCopiedTextMap] = useState<Record<string, boolean>>({})

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedTextMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedTextMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  const runCode = () => {
    setIsRunning(true)
    setTerminalOutput(['$ kilat run ' + templates[selectedTemplate].name])
    
    let i = 0
    const logs = templates[selectedTemplate].output
    
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTerminalOutput(prev => [...prev, logs[i]])
        i++
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 350)
  }

  useEffect(() => {
    setTerminalOutput(['$ click "Run Code" to execute ' + templates[selectedTemplate].name])
  }, [selectedTemplate])

  return (
    <div className="portal-container">
      <div className="glow-mesh purple-glow"></div>
      <div className="glow-mesh cyan-glow"></div>
      <div className="tech-grid"></div>

      <header className="portal-header">
        <div className="header-inner">
          <div className="brand">
            <span className="spark-icon">⚡</span>
            <span className="brand-name">kilat</span>
            <span className="badge">v3.0.0</span>
          </div>
          <div className="header-actions">
            <a href="https://github.com/IHx-cmyk/kilat" target="_blank" rel="noreferrer" className="btn-github-top">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <section className="portal-hero">
          <div className="hero-badge-wrap">
            <span className="badge-glow-dot"></span>
            Go-Powered JS & TS Runtime
          </div>
          <h1 className="hero-glow-title">Kilat</h1>
          <p className="hero-lead">
            Runtime JavaScript dan TypeScript ultra-ringan yang dirancang khusus untuk perangkat Termux Android dan Linux. Cepat, modular, dan berjalan tanpa direktori <code>node_modules</code> lokal.
          </p>
          <div className="hero-buttons-wrap">
            <a href="#install" className="hero-btn primary-glow">Mulai Instalasi</a>
            <a href="#api" className="hero-btn secondary-glow">Pelajari API</a>
          </div>
        </section>

        <section className="portal-sandbox">
          <div className="sandbox-header">
            <h2>Interactive Code Sandbox</h2>
            <p>Pilih template kode di bawah dan jalankan langsung untuk melihat bagaimana Kilat bekerja.</p>
          </div>
          
          <div className="sandbox-wrapper">
            <div className="sandbox-sidebar">
              <button className={`sandbox-tab ${selectedTemplate === 'typescript' ? 'active' : ''}`} onClick={() => setSelectedTemplate('typescript')}>
                <span className="tab-dot typescript"></span> TypeScript Execution
              </button>
              <button className={`sandbox-tab ${selectedTemplate === 'fetch' ? 'active' : ''}`} onClick={() => setSelectedTemplate('fetch')}>
                <span className="tab-dot fetch"></span> Async Fetch API
              </button>
              <button className={`sandbox-tab ${selectedTemplate === 'shell' ? 'active' : ''}`} onClick={() => setSelectedTemplate('shell')}>
                <span className="tab-dot shell"></span> Command Executor ($)
              </button>
              <button className={`sandbox-tab ${selectedTemplate === 'server' ? 'active' : ''}`} onClick={() => setSelectedTemplate('server')}>
                <span className="tab-dot server"></span> Bun.serve HTTP Server
              </button>
            </div>

            <div className="sandbox-editor-panel">
              <div className="panel-titlebar">
                <span className="panel-title">{templates[selectedTemplate].name}</span>
                <button className="run-button" onClick={runCode} disabled={isRunning}>
                  {isRunning ? 'Running...' : 'Run Code ⚡'}
                </button>
              </div>
              <div className="editor-body">
                <pre>
                  <code>{templates[selectedTemplate].code}</code>
                </pre>
              </div>
            </div>

            <div className="sandbox-terminal-panel">
              <div className="panel-titlebar">
                <span className="panel-title">Console Output</span>
              </div>
              <div className="terminal-body">
                <pre>
                  <code>
                    {terminalOutput.map((line, idx) => (
                      <div key={idx} className={line.startsWith('$') ? 'term-prompt-line' : 'term-out-line'}>{line}</div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="portal-comparison">
          <div className="comparison-header">
            <h2>Kilat vs Node.js</h2>
            <p>Bagaimana runtime Kilat membebaskan Termux Anda dari beban eksekusi engine Node standar.</p>
          </div>
          
          <div className="comparison-cards">
            <div className="comp-card">
              <div className="comp-metric">~2ms</div>
              <h3>Waktu Startup</h3>
              <p>Kilat siap mengeksekusi skrip dalam milidetik berkat engine Goja yang efisien. Node.js membutuhkan waktu hingga 45ms+ hanya untuk inisialisasi awal.</p>
            </div>
            <div className="comp-card">
              <div className="comp-metric">0 B</div>
              <h3>Ukuran Proyek</h3>
              <p>Dependensi NPM dipetakan ke cache global. Folder proyek Anda tetap bersih tanpa <code>node_modules</code> yang memakan ruang disk Android.</p>
            </div>
            <div className="comp-card">
              <div className="comp-metric">6 MB</div>
              <h3>Ukuran Binary</h3>
              <p>Seluruh runtime Kilat dikemas ke dalam biner mandiri yang sangat kecil, menghemat RAM dan baterai saat dijalankan di latar belakang.</p>
            </div>
          </div>
        </section>

        <section id="api" className="portal-api-ref">
          <div className="section-titlebar">
            <h2>API & Modul Referensi</h2>
            <p>Daftar modul internal siap pakai tanpa perlu konfigurasi tambahan.</p>
          </div>

          <div className="api-grid">
            <div className="api-card">
              <span className="api-badge">built-in</span>
              <h3>globalThis.$</h3>
              <p>Eksekutor perintah shell Termux secara asinkron. Dukungan string dan tag template literal.</p>
              <pre><code>const out = await $`ls -la\`;</code></pre>
            </div>

            <div className="api-card">
              <span className="api-badge">built-in</span>
              <h3>globalThis.fetch</h3>
              <p>Mendukung pengambilan resource eksternal HTTP secara asinkron berbasis Promise.</p>
              <pre><code>const res = await fetch(url);</code></pre>
            </div>

            <div className="api-card">
              <span className="api-badge">module</span>
              <h3>require('fs')</h3>
              <p>Operasi berkas sinkron di media penyimpanan Termux.</p>
              <pre><code>fs.writeFileSync('k.txt', 'Kilat');</code></pre>
            </div>

            <div className="api-card">
              <span className="api-badge">module</span>
              <h3>require('os')</h3>
              <p>Membaca parameter lingkungan (environment) dan argument CLI.</p>
              <pre><code>const osType = os.getenv('OSTYPE');</code></pre>
            </div>

            <div className="api-card">
              <span className="api-badge">built-in</span>
              <h3>Bun.serve</h3>
              <p>Inisialisasi HTTP server asinkron berkinerja tinggi untuk API lokal Anda.</p>
              <pre><code>Bun.serve(&#123; fetch(req) &#123; ... &#125; &#125;);</code></pre>
            </div>

            <div className="api-card">
              <span className="api-badge">built-in</span>
              <h3>console.log</h3>
              <p>Menulis log berwarna ke console output terminal Anda.</p>
              <pre><code>console.log('Complete!', 'green');</code></pre>
            </div>
          </div>
        </section>

        <section id="install" className="portal-install">
          <div className="install-content">
            <h2>Dapatkan Kilat Sekarang</h2>
            <p>Gunakan perintah instalasi otomatis untuk memindai perangkat, mengunduh biner rilis, dan mengintegrasikan Kilat ke Termux / Linux.</p>
            
            <div className="install-terminal">
              <div className="term-head">
                <span className="term-circle red"></span>
                <span className="term-circle yellow"></span>
                <span className="term-circle green"></span>
              </div>
              <div className="term-body-code">
                <code>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash</code>
                <button className="copy-btn-term" onClick={() => handleCopy('portal-inst', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/kilat/main/install.sh | bash')}>
                  {copiedTextMap['portal-inst'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="portal-footer">
        <div className="footer-inner">
          <p>MIT License © 2026 Kilat. Dibuat seadanya untuk optimasi Termux Android.</p>
        </div>
      </footer>
    </div>
  )
}
