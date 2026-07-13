import React, { useState, useEffect, useRef } from 'react'

interface PageItem {
  key: string
  title: string
  icon: React.ReactNode
}

const dict = {
  id: {
    console: 'Console',
    playground: 'Contoh',
    architecture: 'Arsitektur & FAQ',
    install: 'Instalasi',
    api: 'API Referensi',
    changelog: 'Changelog',
    heroHeading: 'Supercharge JavaScript & TypeScript on Termux',
    heroLead: 'Kilat adalah runtime minimalis bertenaga Go untuk eksekusi script kilat di perangkat seluler. Tanpa beban direktori node_modules, memuat instan, dan siap pakai.',
    installerChannel: 'installer channel',
    benchmarkTitle: 'BENCHMARK KINERJA OBJEKTIF',
    metricHeader: 'Metrik Uji',
    nodeHeader: 'Node.js (v20.11)',
    kilatHeader: 'Kilat Runtime',
    gainHeader: 'Selisih Keuntungan',
    startupMetric: 'Waktu Startup Terdingin',
    ramMetric: 'Alokasi Memori Awal (RAM)',
    depMetric: 'Beban Folder Dependency',
    compMetric: 'Compiler TypeScript',
    startupGain: '~18x Lebih Cepat',
    ramGain: '~4x Lebih Hemat',
    depGain: '100% Hemat Disk',
    compGain: 'Tanpa Overhead Setup',
    externalCompiler: 'Eksternal (ts-node)',
    inMemoryCompiler: 'Bawaan (esbuild)',
    engineTitle: 'Ringan & Kencang',
    engineDesc: 'Inisialisasi engine Goja yang sangat cepat (~2ms), membebaskan RAM Termux dari overhead V8 Node.js.',
    compilerTitle: 'TypeScript Bawaan',
    compilerDesc: 'Dukungan instan untuk berkas .ts, .tsx, dan .jsx via esbuild memori tanpa transpiler eksternal.',
    cacheTitle: 'Bebas node_modules',
    cacheDesc: 'Dependency dipetakan langsung ke cache global tunggal untuk menghemat penyimpanan disk internal HP.',
    
    codeTitle: 'Cuplikan Kode & Contoh',
    codeSub: 'Pelajari cara menulis skrip, server, dan script otomasi shell di runtime Kilat.',
    codeSample1Title: 'Hello World dasar',
    codeSample1Desc: 'Menulis teks keluaran standar ke terminal konsol.',
    codeSample2Title: 'HTTP Server Asinkron',
    codeSample2Desc: 'Membuat endpoint server HTTP non-blocking dengan API standard Bun.',
    codeSample3Title: 'Shell Script Executor',
    codeSample3Desc: 'Menjalankan utilitas Linux secara asinkron dari file Javascript.',

    archTitle: 'Arsitektur & Logika Sistem',
    archSub: 'Analisis mendalam bagaimana biner tunggal Kilat mengeksekusi kode JavaScript secara asinkron.',
    arch1Title: '1. Runtime Mesin Virtual (Goja Engine)',
    arch1Desc: 'Kilat tidak menggunakan V8 Engine milik Google yang berukuran besar dan membutuhkan alokasi RAM minimal ~30MB hanya untuk memuat lingkungan dasar. Sebagai gantinya, Kilat mengintegrasikan Goja VM, interpreter ECMAScript 5.1/6 yang ditulis murni dalam bahasa Go. Hal ini memungkinkan bytecode dievaluasi langsung di tingkat kernel memori dengan alokasi awal RAM yang sangat kecil (~7.8MB).',
    arch2Title: '2. Transpilasi Memori TypeScript (esbuild integration)',
    arch2Desc: 'Ketika pengguna mengeksekusi berkas TypeScript, Kilat tidak menulis ulang file JavaScript sementara ke dalam penyimpanan disk HP (yang lambat dan mengurangi masa pakai memori flash). Biner esbuild internal diintegrasikan secara statis untuk melakukan kompilasi baris TypeScript menjadi string kode JavaScript langsung di dalam memori RAM sesaat sebelum diumpankan ke Goja VM.',
    arch3Title: '3. Asynchronous Event-Loop via Go Channels',
    arch3Desc: 'Untuk mendukung operasi I/O non-blocking (seperti fetch asinkron dan modul $ shell executor), Kilat mengimplementasikan event-loop asinkron menggunakan mekanisme internal Go channel dan goroutine. Setiap kali operasi asinkron dipicu dari JavaScript, Goja VM akan mendelegasikan tugas tersebut ke goroutine latar belakang dan mengembalikan Promise ke thread utama. Setelah goroutine menyelesaikan tugasnya, hasilnya akan dikirim kembali melalui Go channel ke event-loop untuk menyelesaikan status Promise.',
    
    personalTitle: 'Kenapa Kilat Dibuat?',
    personalDesc: 'Kilat dibuat oleh ihsannyy karena keresahan pribadi saat mengembangkan script otomasi dan bot di HP Android menggunakan Termux. Node.js terlalu memakan penyimpanan internal HP dengan folder node_modules yang duplikat di setiap proyek, serta memakan RAM yang cukup besar saat dijalankan di perangkat berspesifikasi rendah. Kilat lahir sebagai solusi: minimalis, bertenaga Go, memuat dalam 2ms, dan menghemat memori internal dengan caching dependency global.',
    faqTitle: 'Pertanyaan Umum (FAQ)',
    faq1Quest: 'Apa bedanya Kilat dengan Node.js?',
    faq1Ans: 'Node.js menggunakan V8 Engine dan memerlukan folder node_modules lokal di setiap proyek. Kilat menggunakan Goja VM (Go-based JS interpreter) dan esbuild untuk kompilasi memori, serta menggunakan cache global satu-satunya. Kilat jauh lebih hemat RAM (~8MB) dan penyimpanan disk (0B untuk dependensi lokal).',
    faq2Quest: 'Apakah Kilat mendukung semua package npm?',
    faq2Ans: 'Kilat mendukung modul standard CommonJS dan ES Modules murni. Namun, modul yang bergantung pada API native C++ milik Node.js atau API Node internal tingkat rendah (seperti beberapa bagian dgram/child_process yang spesifik) tidak didukung karena interpreter kami didesain ringan.',
    faq3Quest: 'Bagaimana cara menghapus (uninstall) Kilat?',
    faq3Ans: 'Sangat mudah. Anda hanya perlu menghapus biner kilat dan folder cachenya dengan menjalankan perintah: rm -f $PREFIX/bin/kilat && rm -rf ~/.kilat',

    instTitle: 'Instalasi Runtime',
    instSub: 'Panduan pemasangan biner statis Kilat di perangkat Anda.',
    instAuto: '1. Instalasi Skrip Otomatis',
    instAutoDesc: 'Mendeteksi arsitektur CPU dan memasang biner secara otomatis:',
    instVerify: '2. Verifikasi Pemasangan',
    instVerifyDesc: 'Jalankan perintah ini untuk memastikan biner Kilat aktif:',
    apiTitle: 'API Referensi',
    apiSub: 'Daftar global API dan core module built-in bawaan Kilat.',
    changeTitle: 'Release Changelog',
    changeSub: 'Riwayat pembaruan biner statis Kilat.',
    change4: 'Rilis ini memperkenalkan perintah **`kilat remove <package>`** untuk menghapus dependency secara lokal, dan **`kilat build <in> <out>`** untuk membundel serta meminifikasi berkas JS/TS untuk produksi. Ditambahkan juga **fallback DNS resolver** baru untuk memecahkan masalah koneksi internet di lingkungan Termux Android, serta peningkatan sistem resolusi modul NPM untuk membaca properti `"main"` berkas `package.json`.',
    change3: 'Rilis major ini memperkenalkan **Global Shell Command Execution ($)**. Dukungan asinkron penuh menggunakan goroutine untuk mengeksekusi biner eksternal dan CLI utilitas di Termux / Linux.',
    change2: 'Rilis minor ini memperkenalkan **Global Fetch API (fetch)** yang terintegrasi secara asinkron dengan event-loop untuk pemanggilan API dan transfer data HTTP.',
    change1: 'Integrasi compiler esbuild internal untuk mendukung pemuatan file TypeScript (TS, TSX, JSX) dan transpiler ES Modules (ESM) di memori secara otomatis.',
    footer: 'Lisensi MIT © 2026 Kilat. Dibuat seadanya oleh ihsannyy untuk optimasi Termux Android.'
  },
  en: {
    console: 'Console',
    playground: 'Examples',
    architecture: 'Architecture & FAQ',
    install: 'Installation',
    api: 'API Reference',
    changelog: 'Changelog',
    heroHeading: 'Supercharge JavaScript & TypeScript on Termux',
    heroLead: 'Kilat is a minimalist Go-powered runtime built for lightning-fast script execution on mobile devices. Bypasses node_modules, boots instantly, and runs natively.',
    installerChannel: 'installer channel',
    benchmarkTitle: 'OBJECTIVE PERFORMANCE BENCHMARKS',
    metricHeader: 'Benchmark Metric',
    nodeHeader: 'Node.js (v20.11)',
    kilatHeader: 'Kilat Runtime',
    gainHeader: 'Net Advantage',
    startupMetric: 'Cold Startup Latency',
    ramMetric: 'Initial Memory Allocation (RAM)',
    depMetric: 'Dependency Storage Burden',
    compMetric: 'TypeScript Compiler Overhead',
    startupGain: '~18x Faster',
    ramGain: '~4x More Efficient',
    depGain: '100% Storage Savings',
    compGain: 'Zero Configuration Setup',
    externalCompiler: 'External (ts-node)',
    inMemoryCompiler: 'In-Memory (esbuild)',
    engineTitle: 'Lightweight & Swift',
    engineDesc: 'Blazing-fast Goja engine initialization (~2ms), freeing Termux RAM from heavy V8 Node.js overhead.',
    compilerTitle: 'Native TypeScript',
    compilerDesc: 'Instant support for .ts, .tsx, and .jsx files via in-memory esbuild without external transpilers.',
    cacheTitle: 'Zero node_modules',
    cacheDesc: 'Dependencies mapped directly to a global cache, saving internal storage on mobile devices.',
    
    codeTitle: 'Code Snippets & Examples',
    codeSub: 'Learn how to write scripts, servers, and shell automation scripts in the Kilat runtime.',
    codeSample1Title: 'Basic Hello World',
    codeSample1Desc: 'Print standard output text logs directly to the console terminal.',
    codeSample2Title: 'Async HTTP Server',
    codeSample2Desc: 'Spin up non-blocking HTTP endpoints using the built-in Bun-compatible API.',
    codeSample3Title: 'Shell Script Executor',
    codeSample3Desc: 'Execute external Linux CLI utilities asynchronously from JavaScript files.',

    archTitle: 'Architecture & System Logic',
    archSub: 'Deep dive into how Kilat\'s single static binary executes JavaScript code asynchronously.',
    arch1Title: '1. Virtual Machine Runtime (Goja Engine)',
    arch1Desc: 'Kilat avoids Google\'s massive V8 Engine, which demands a minimum of ~30MB RAM just to initialize. Instead, it embeds the Goja VM, a pure Go ECMAScript 5.1/6 interpreter, enabling bytecode evaluation at the memory level with a tiny initial RAM footprint (~7.8MB).',
    arch2Title: '2. In-Memory TypeScript Transpilation (esbuild)',
    arch2Desc: 'When executing TypeScript files, Kilat does not write temporary JavaScript files to slow internal flash storage. An embedded esbuild compiler transpiles TypeScript source code to JS strings directly in RAM just before evaluation.',
    arch3Title: '3. Asynchronous Event-Loop via Go Channels',
    arch3Desc: 'To support non-blocking I/O operations (like async fetch and shell executing), Kilat implements an async event-loop using internal Go channels and goroutines. When an async task starts in JS, the Goja VM delegates it to a background goroutine and returns a Promise. Upon completion, the result is piped back through a Go channel to resolve the Promise.',
    
    personalTitle: 'Why was Kilat Created?',
    personalDesc: 'Kilat was created by ihsannyy out of personal frustration when developing automation scripts and bots on Android devices using Termux. Node.js consumes too much internal phone storage with duplicate node_modules folders in every project, and demands high memory on low-spec devices. Kilat was born as a solution: minimalist, Go-powered, booting in 2ms, and preserving phone storage through global dependency caching.',
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faq1Quest: 'How is Kilat different from Node.js?',
    faq1Ans: 'Node.js runs on V8 Engine and requires a local node_modules folder for every project. Kilat runs on Goja VM (Go-based JS interpreter) with esbuild for in-memory compilation, mapping modules to a single global cache. Kilat uses less RAM (~8MB) and zero disk space for local project dependencies.',
    faq2Quest: 'Does Kilat support all npm packages?',
    faq2Ans: 'Kilat supports pure ES Modules and CommonJS packages. However, packages relying on Node.js native C++ bindings or complex low-level internal Node APIs (such as specific dgram/child_process wrappers) are not supported due to our lightweight design.',
    faq3Quest: 'How do I uninstall Kilat?',
    faq3Ans: 'It is very simple. Delete the kilat binary and its cache directory by running: rm -f $PREFIX/bin/kilat && rm -rf ~/.kilat',

    instTitle: 'Runtime Installation',
    instSub: 'Guide to install the static Kilat binary to your local environment.',
    instAuto: '1. Automated Script Installation',
    instAutoDesc: 'Detects CPU architecture and installs the appropriate binary automatically:',
    instVerify: '2. Verify Installation',
    instVerifyDesc: 'Execute this command to verify the Kilat binary is active:',
    apiTitle: 'API Reference',
    apiSub: 'List of built-in global APIs and core modules available in Kilat.',
    changeTitle: 'Release Changelog',
    changeSub: 'Version release logs of the static Kilat binary.',
    change4: 'This release introduces the **`kilat remove <package>`** command to uninstall dependencies locally, and **`kilat build <in> <out>`** to bundle and minify JS/TS scripts for production. Adds a new **fallback DNS resolver** to bypass network connection failures in Android/Termux environments, and enhances NPM module resolution by supporting `package.json` `"main"` property loading.',
    change3: 'This major release introduces **Global Shell Command Execution ($)**. Full async support using Go goroutines to run external binaries and CLI utilities on Termux / Linux.',
    change2: 'This minor release introduces the **Global Fetch API (fetch)**, asynchronously integrated with the event-loop for HTTP API requests.',
    change1: 'Integrated esbuild compiler for instant in-memory TypeScript (TS, TSX, JSX) and ES Modules (ESM) loading.',
    footer: 'MIT License © 2026 Kilat. Built lightweight by ihsannyy to optimize Termux Android.'
  }
}

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>('id')
  const [activeTab, setActiveTab] = useState<string>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})
  const [timeMode, setTimeMode] = useState<string>('MALAM')
  const [clockText, setClockText] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const pages: PageItem[] = [
    {
      key: 'home',
      title: dict[lang].console,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      )
    },
    {
      key: 'examples',
      title: dict[lang].playground,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      key: 'architecture',
      title: dict[lang].architecture,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    {
      key: 'install',
      title: dict[lang].install,
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
      title: dict[lang].api,
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
      title: dict[lang].changelog,
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

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Fallback copy failed', err)
    }
    document.body.removeChild(textArea)
  }

  const handleCopy = (id: string, text: string) => {
    const trimmed = text.trim()
    const onSuccess = () => {
      setCopiedMap(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedMap(prev => ({ ...prev, [id]: false }))
      }, 2000)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(trimmed)
        .then(onSuccess)
        .catch(() => {
          fallbackCopyText(trimmed)
          onSuccess()
        })
    } else {
      fallbackCopyText(trimmed)
      onSuccess()
    }
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

      ctx.fillStyle = '#020108'
      ctx.beginPath()
      ctx.arc(w - 320, h + 30, 240, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(w - 140, h - 10, 220, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.rect(0, h - 60, w, 60)
      ctx.fill()

      const h1W = 150
      const h1H = 95
      const h1X = w - h1W - 50
      const h1Y = h - h1H - 220

      ctx.fillStyle = '#060416'
      ctx.fillRect(h1X, h1Y, h1W, h1H)

      ctx.fillStyle = '#03020a'
      ctx.beginPath()
      ctx.moveTo(h1X - 12, h1Y)
      ctx.lineTo(h1X + h1W / 2, h1Y - 40)
      ctx.lineTo(h1X + h1W + 12, h1Y)
      ctx.closePath()
      ctx.fill()

      ctx.fillRect(h1X + 20, h1Y - 35, 15, 25)

      ctx.fillStyle = '#020108'
      ctx.fillRect(h1X + h1W / 2 - 14, h1Y + h1H - 45, 28, 45)

      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)'
      ctx.shadowColor = '#ffea79'
      ctx.shadowBlur = 32
      ctx.fillRect(h1X + 22, h1Y + 22, 22, 22)
      ctx.fillRect(h1X + h1W - 44, h1Y + 22, 22, 22)
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#060416'
      ctx.lineWidth = 1.5
      ctx.strokeRect(h1X + 22, h1Y + 22, 22, 22)
      ctx.beginPath()
      ctx.moveTo(h1X + 33, h1Y + 22)
      ctx.lineTo(h1X + 33, h1Y + 44)
      ctx.moveTo(h1X + 22, h1Y + 33)
      ctx.lineTo(h1X + 44, h1Y + 33)
      ctx.stroke()

      ctx.strokeRect(h1X + h1W - 44, h1Y + 22, 22, 22)
      ctx.beginPath()
      ctx.moveTo(h1X + h1W - 33, h1Y + 22)
      ctx.lineTo(h1X + h1W - 33, h1Y + 44)
      ctx.moveTo(h1X + h1W - 44, h1Y + 33)
      ctx.lineTo(h1X + h1W - 22, h1Y + 33)
      ctx.stroke()

      const h2W = 110
      const h2H = 75
      const h2X = w - h2W - 190
      const h2Y = h - h2H - 170

      ctx.fillStyle = '#050313'
      ctx.fillRect(h2X, h2Y, h2W, h2H)

      ctx.fillStyle = '#020108'
      ctx.beginPath()
      ctx.moveTo(h2X - 10, h2Y)
      ctx.lineTo(h2X + h2W / 2, h2Y - 30)
      ctx.lineTo(h2X + h2W + 10, h2Y)
      ctx.closePath()
      ctx.fill()

      ctx.fillRect(h2X + h2W / 2 - 12, h2Y + h2H - 35, 24, 35)

      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)'
      ctx.shadowColor = '#ffea79'
      ctx.shadowBlur = 32
      ctx.fillRect(h2X + 18, h2Y + 18, 18, 18)
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#050313'
      ctx.strokeRect(h2X + 18, h2Y + 18, 18, 18)
      ctx.beginPath()
      ctx.moveTo(h2X + 27, h2Y + 18)
      ctx.lineTo(h2X + 27, h2Y + 36)
      ctx.moveTo(h2X + 18, h2Y + 27)
      ctx.lineTo(h2X + 36, h2Y + 27)
      ctx.stroke()

      const h3W = 85
      const h3H = 60
      const h3X = w - h3W - 290
      const h3Y = h - h3H - 110

      ctx.fillStyle = '#040310'
      ctx.fillRect(h3X, h3Y, h3W, h3H)

      ctx.fillStyle = '#020108'
      ctx.beginPath()
      ctx.moveTo(h3X - 8, h3Y)
      ctx.lineTo(h3X + h3W / 2, h3Y - 24)
      ctx.lineTo(h3X + h3W + 8, h3Y)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)'
      ctx.shadowColor = '#ffea79'
      ctx.shadowBlur = 32
      ctx.fillRect(h3X + h3W - 32, h3Y + 16, 16, 16)
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#040310'
      ctx.strokeRect(h3X + h3W - 32, h3Y + 16, 16, 16)
      ctx.beginPath()
      ctx.moveTo(h3X + h3W - 24, h3Y + 16)
      ctx.lineTo(h3X + h3W - 24, h3Y + 32)
      ctx.moveTo(h3X + h3W - 32, h3Y + 24)
      ctx.lineTo(h3X + h3W - 16, h3Y + 24)
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

  const t = dict[lang]

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
            <span className="badge">v3.1.0</span>
          </div>

          <nav className="navbar-links desktop-only">
            {pages.map(p => (
              <button key={p.key} className={`nav-tab-btn ${activeTab === p.key ? 'active' : ''}`} onClick={() => setActiveTab(p.key)}>
                {p.title}
              </button>
            ))}
          </nav>

          <div className="navbar-actions">
            <button className="lang-toggle-btn" onClick={() => setLang(lang === 'id' ? 'en' : 'id')}>
              {lang === 'id' ? 'EN' : 'ID'}
            </button>

            <div className="environment-clock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="clock-svg">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="time-lbl">MODE:&nbsp;</span>
              <span className="time-mode-name">{timeMode}</span>
              <span className="time-val">&nbsp;[{clockText}]</span>
            </div>
            
            <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="btn-github-link" aria-label="GitHub">
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
        <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
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
                <h1 className="hero-heading">{t.heroHeading}</h1>
                <p className="hero-lead">{t.heroLead}</p>

                <div className="terminal-install-box">
                  <div className="box-hdr">
                    <div className="leds">
                      <span className="led red"></span>
                      <span className="led yellow"></span>
                      <span className="led green"></span>
                    </div>
                    <span className="box-title">{t.installerChannel}</span>
                  </div>
                  <div className="box-body">
                    <div className="code-scroll-wrapper">
                      <code>curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash</code>
                    </div>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('hero-inst', 'curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash')}>
                      {copiedMap['hero-inst'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              <section className="benchmarks-table-wrapper">
                <h2 className="section-subtitle-technical">{t.benchmarkTitle}</h2>
                <div className="glass-table-container">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>{t.metricHeader}</th>
                        <th>{t.nodeHeader}</th>
                        <th>{t.kilatHeader}</th>
                        <th>{t.gainHeader}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>{t.startupMetric}</strong></td>
                        <td>38.2 ms</td>
                        <td className="text-cyan">2.1 ms</td>
                        <td className="text-green">{t.startupGain}</td>
                      </tr>
                      <tr>
                        <td><strong>{t.ramMetric}</strong></td>
                        <td>31.4 MB</td>
                        <td className="text-cyan">7.8 MB</td>
                        <td className="text-green">{t.ramGain}</td>
                      </tr>
                      <tr>
                        <td><strong>{t.depMetric}</strong></td>
                        <td>~120 MB / proj</td>
                        <td className="text-cyan">0 B (Global Cache)</td>
                        <td className="text-green">{t.depGain}</td>
                      </tr>
                      <tr>
                        <td><strong>{t.compMetric}</strong></td>
                        <td>{t.externalCompiler}</td>
                        <td className="text-cyan">{t.inMemoryCompiler}</td>
                        <td className="text-green">{t.compGain}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="features-glass-grid">
                <div className="glass-card">
                  <div className="card-badge">ENGINE</div>
                  <h3>{t.engineTitle}</h3>
                  <p>{t.engineDesc}</p>
                </div>

                <div className="glass-card">
                  <div className="card-badge">COMPILER</div>
                  <h3>{t.compilerTitle}</h3>
                  <p>{t.compilerDesc}</p>
                </div>

                <div className="glass-card">
                  <div className="card-badge">CACHE</div>
                  <h3>{t.cacheTitle}</h3>
                  <p>{t.cacheDesc}</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">{t.codeTitle}</h2>
              <p className="pane-subtitle">{t.codeSub}</p>

              <div className="playground-code-grid">
                <div className="vscode-editor-container">
                  <div className="vscode-header">
                    <div className="editor-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <span className="editor-file">index.js</span>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('c1', 'console.log("Kilat runtime is active!");')}>
                      {copiedMap['c1'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="vscode-body">
                    <div className="editor-nums">
                      <span>1</span><span>2</span>
                    </div>
                    <pre><code>{`console.log("Kilat runtime is active!");`}</code></pre>
                  </div>
                  <p className="editor-label-desc">{t.codeSample1Desc}</p>
                </div>

                <div className="vscode-editor-container">
                  <div className="vscode-header">
                    <div className="editor-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <span className="editor-file">server.ts</span>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('c2', `Bun.serve({
  port: 8080,
  fetch(req) {
    return new Response("Hello from Kilat!");
  }
});`)}>
                      {copiedMap['c2'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="vscode-body">
                    <div className="editor-nums">
                      <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                    </div>
                    <pre><code>{`Bun.serve({
  port: 8080,
  fetch(req) {
    return new Response("Hello from Kilat!");
  }
});`}</code></pre>
                  </div>
                  <p className="editor-label-desc">{t.codeSample2Desc}</p>
                </div>

                <div className="vscode-editor-container">
                  <div className="vscode-header">
                    <div className="editor-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <span className="editor-file">exec.js</span>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('c3', `const out = await $\`free -h\`;\nconsole.log(out);`)}>
                      {copiedMap['c3'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="vscode-body">
                    <div className="editor-nums">
                      <span>1</span><span>2</span>
                    </div>
                    <pre><code>{`const out = await $\`free -h\`;
console.log(out);`}</code></pre>
                  </div>
                  <p className="editor-label-desc">{t.codeSample3Desc}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">{t.archTitle}</h2>
              <p className="pane-subtitle">{t.archSub}</p>

              <div className="glass-panel">
                <h3>{t.arch1Title}</h3>
                <p>{t.arch1Desc}</p>
              </div>

              <div className="glass-panel">
                <h3>{t.arch2Title}</h3>
                <p>{t.arch2Desc}</p>
              </div>

              <div className="glass-panel">
                <h3>{t.arch3Title}</h3>
                <p>{t.arch3Desc}</p>
              </div>

              <h2 className="pane-title" style={{ marginTop: '48px' }}>{t.personalTitle}</h2>
              <p className="pane-subtitle">{t.personalDesc}</p>

              <h2 className="pane-title" style={{ marginTop: '48px' }}>{t.faqTitle}</h2>
              <div className="glass-panel" style={{ marginTop: '16px' }}>
                <h3 style={{ color: 'var(--secondary)' }}>Q: {t.faq1Quest}</h3>
                <p style={{ marginTop: '8px' }}>A: {t.faq1Ans}</p>
              </div>
              <div className="glass-panel">
                <h3 style={{ color: 'var(--secondary)' }}>Q: {t.faq2Quest}</h3>
                <p style={{ marginTop: '8px' }}>A: {t.faq2Ans}</p>
              </div>
              <div className="glass-panel">
                <h3 style={{ color: 'var(--secondary)' }}>Q: {t.faq3Quest}</h3>
                <p style={{ marginTop: '8px' }}>A: {t.faq3Ans}</p>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">{t.instTitle}</h2>
              <p className="pane-subtitle">{t.instSub}</p>

              <div className="glass-panel">
                <h3>{t.instAuto}</h3>
                <p>{t.instAutoDesc}</p>
                <div className="terminal-install-box">
                  <div className="box-hdr">
                    <div className="leds">
                      <span className="led"></span>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="code-scroll-wrapper">
                      <code>curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash</code>
                    </div>
                    <button className="copy-bezel-btn" onClick={() => handleCopy('inst-auto', 'curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash')}>
                      {copiedMap['inst-auto'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel">
                <h3>{t.instVerify}</h3>
                <p>{t.instVerifyDesc}</p>
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
                      {copiedMap['inst-verify'] ? 'COPIED' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          COPY
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="pane-view animate-in">
              <h2 className="pane-title">{t.apiTitle}</h2>
              <p className="pane-subtitle">{t.apiSub}</p>

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
              <h2 className="pane-title">{t.changeTitle}</h2>
              <p className="pane-subtitle">{t.changeSub}</p>

              <div className="changelog-timeline">
                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v3.1.0</span>
                    <span className="date">13 Juli 2026</span>
                    <span className="led green active"></span>
                  </div>
                  <p>{t.change4}</p>
                </div>

                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v3.0.0</span>
                    <span className="date">11 Juli 2026</span>
                    <span className="led"></span>
                  </div>
                  <p>{t.change3}</p>
                </div>

                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v2.1.0</span>
                    <span className="date">11 Juli 2026</span>
                  </div>
                  <p>{t.change2}</p>
                </div>

                <div className="timeline-segment">
                  <div className="segment-hdr">
                    <span className="ver">v2.0.0</span>
                    <span className="date">1 Juli 2026</span>
                  </div>
                  <p>{t.change1}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="portal-footer">
        <p>{t.footer}</p>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="https://github.com/ihsannyy/kilat" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }} onMouseOver={(e) => (e.currentTarget.style.color = '#fff')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>GitHub Repository</a>
          <a href="https://github.com/ihsannyy/kilat/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }} onMouseOver={(e) => (e.currentTarget.style.color = '#fff')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Report Bugs</a>
          <a href="https://github.com/ihsannyy/kilat/blob/main/LICENSE" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }} onMouseOver={(e) => (e.currentTarget.style.color = '#fff')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>MIT License</a>
        </div>
      </footer>
    </div>
  )
}
