<div align="center">

<img src="docs/kilat.png" alt="Kilat Logo" width="140"/>

# KILAT

**Runtime JavaScript & TypeScript ultra-ringan yang dirancang khusus untuk Termux, Linux, dan perangkat ber-resource terbatas.**

[![GitHub Release](https://img.shields.io/github/v/release/ihsannyy/kilat?style=flat-square&color=f59e0b)](https://github.com/ihsannyy/kilat/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Go Report Card](https://goreportcard.com/badge/github.com/ihsannyy/kilat?style=flat-square)](https://goreportcard.com/report/github.com/ihsannyy/kilat)
[![Platform](https://img.shields.io/badge/platform-linux--amd64%20%7C%20linux--arm64%20%7C%20darwin--amd64%20%7C%20darwin--arm64%20%7C%20windows--amd64-lightgrey?style=flat-square)]()

[English](README.md) • [Bahasa Indonesia](README.id.md)

```bash
curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash
```

</div>

---

## Ringkasan

Runtime JavaScript modern seperti Node.js dan Bun sangat bertenaga di laptop atau server berspesifikasi tinggi, namun terasa berat pada lingkungan dengan keterbatasan memori dan penyimpanan seperti **Android (Termux)**, Raspberry Pi, perangkat IoT, atau VPS low-spec:

- **Node.js**: Waktu cold start lambat (35-100ms+), konsumsi RAM dasar tinggi (~31MB), dan duplikasi folder `node_modules` menghabiskan memori internal smartphone/VPS.
- **Bun**: Kencang di Linux x86/ARM, namun tidak mendukung Android/Termux secara native tanpa konfigurasi proot glibc yang rumit.
- **Kilat**: Dibangun dari awal menggunakan **Go + Goja**. Hadir sebagai satu file binary mandiri (single binary) tanpa ketergantungan library luar, startup dalam **~2ms**, konsumsi idle RAM hanya **~8MB**, kompilasi TypeScript langsung di memori, dan seluruh package disimpan terpusat di global cache (`~/.kilat/packages/`).

---

## Tabel Perbandingan (Benchmark)

Diuji langsung pada lingkungan Termux ARM64 di perangkat Android:

| Metrik | Node.js v20 | Bun v1.1 (proot) | Kilat v5.0.0 |
|:---|:---:|:---:|:---:|
| **Startup (Cold Start)** | ~38 ms | ~18 ms | **~2 ms** *(19x lebih cepat)* |
| **Konsumsi RAM (RSS)** | ~31 MB | ~28 MB | **~8 MB** *(4x lebih hemat)* |
| **Penyimpanan (10 Proyek)** | ~1.2 GB | ~850 MB | **0 MB** *(Cache Global)* |
| **TypeScript / TSX** | Butuh konfigurasi | Built-in | **Built-in (Zero Config)** |
| **Dukungan Native Termux** | Paket apt berat | Tidak didukung | **Native Single Binary** |
| **SQLite Built-in** | Perlu npm package | Built-in | **Built-in (`sql`)** |
| **Scheduler (Cron) Built-in** | Perlu npm package | Perlu npm package | **Built-in (`cron`)** |
| **In-Memory Cache Built-in** | Perlu npm package | Perlu npm package | **Built-in (`cache`)** |

---

## Fitur Utama

- ⚡ **Startup Sub-2ms** — Eksekusi file dan script CLI secara instan tanpa proses pemanasan JIT V8 yang berat.
- 🪶 **Penggunaan RAM ~8MB** — Berjalan mulus di VPS 512MB RAM, Raspberry Pi, dan smartphone Android.
- 📦 **Zero-Duplication Global Cache** — Package yang diinstal lewat `kilat add` disimpan terpusat di `~/.kilat/packages/`. 10 proyek tidak lagi menduplikasi isi node_modules.
- 🔷 **TypeScript & TSX Native** — Langsung jalankan file `.ts`, `.tsx`, `.js`, dan `.jsx` tanpa butuh `tsconfig.json` atau ts-node.
- 🌐 **HTTP Server Bergaya Bun** — Server HTTP bawaan berkemampuan tinggi via `Kilat.serve()` yang ditenagai oleh web engine Go.
- 💾 **Database SQLite Tersemat** — Modul `sql` bawaan dengan prepared statement dan transaksi database tanpa instal driver tambahan.
- ⏱️ **Cache TTL & Cron Terintegrasi** — Menyediakan in-memory cache dengan waktu kedaluwarsa (`cache`) dan penjadwalan tugas (`cron`).
- 🐚 **Eksekusi Shell via Goroutine** — Eksekusi perintah bash/shell secara asinkron dengan helper `$()` berbasis goroutine Go.
- 🛠️ **Tooling Lengkap** — Bundler & minifier (`kilat build`), pembuat project template (`kilat create`), interactive REPL, dan live reload (`--watch`).

---

## Panduan Instalasi

### Skrip Otomatis (Termux, Linux, macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash
```

### Binary Siap Pakai (Pre-built Binaries)

Unduh binary mandiri langsung dari [GitHub Releases](https://github.com/ihsannyy/kilat/releases) untuk:
- Linux (`amd64`, `arm64`)
- Android / Termux (`arm64`, `amd64`)
- macOS (`Apple Silicon arm64`, `Intel amd64`)
- Windows (`amd64`)

### Build Manual dari Source

Kebutuhan: Go versi 1.21 atau lebih baru.

```bash
git clone https://github.com/ihsannyy/kilat.git
cd kilat
go build -o kilat ./cmd/kilat

# Pindahkan ke PATH (Termux):
cp kilat $PREFIX/bin/

# Atau di Linux / macOS:
sudo mv kilat /usr/local/bin/
```

---

## Perintah CLI

```
Penggunaan: kilat <perintah> [opsi]

Perintah:
  run <file> [--watch]       Menjalankan file JavaScript atau TypeScript
  start                      Menjalankan script "start" di package.json atau index.ts/js
  create <template> [nama]   Membuat proyek baru dari template siap pakai
  add <package>              Menginstal package ke dalam cache global
  remove <package>           Menghapus package dari cache global
  build <input> <output>     Melakukan bundle dan minify kode ke dalam satu file
  repl                       Membuka sesi konsol interaktif REPL
  init [-y]                  Membuat file package.json di folder aktif
  info                       Menampilkan info runtime, platform, dan path cache

Flags:
  --version, -v              Menampilkan versi Kilat
  --update                   Memeriksa dan memperbarui Kilat ke versi terbaru
  --watch, -w                Mengaktifkan auto-restart saat terjadi perubahan file
```

---

## 15 Modul Bawaan (Standard Library)

| Modul | Kegunaan | Contoh Method Utama |
|:---|:---|:---|
| `fs` | Manajemen berkas dan folder | `readFile`, `readFileSync`, `writeFile`, `writeFileSync`, `readdir`, `stat`, `existsSync` |
| `os` | Informasi sistem operasi | `platform()`, `arch()`, `cpus()`, `totalmem()`, `freemem()`, `homedir()`, `hostname()` |
| `path` | Manipulasi path direktori | `join()`, `resolve()`, `basename()`, `dirname()`, `extname()` |
| `crypto` | Enkripsi, hashing, dan token | `randomBytes()`, `createHash()`, `md5()`, `sha256()`, `uuid()` |
| `child_process` | Menjalankan proses shell eksternal | `exec()`, `execSync()`, `spawn()` |
| `buffer` | Pengolahan data biner | `Buffer.from()`, `Buffer.alloc()`, `Buffer.concat()` |
| `stream` | Pemrosesan data berurutan (streams) | `Readable`, `Writable`, `Transform` |
| `timers` | Pewaktu asinkron | `setTimeout()`, `clearTimeout()`, `setInterval()`, `clearInterval()` |
| `websocket` | Koneksi WebSocket dua arah | WebSocket client dengan listener `open`, `message`, `close` |
| `net` | Jaringan soket dan protokol | TCP socket, koneksi jaringan HTTP |
| `log` | Pencatatan log terstruktur berwarna | `log.info()`, `log.warn()`, `log.error()`, `log.debug()`, `log.success()` |
| `events` | Pola pub/sub (event emitter) | `EventEmitter` dengan `on()`, `once()`, `emit()`, `off()` |
| `cache` | In-memory key-value cache dengan TTL | `cache.set(kunci, nilai, ttlDetik)`, `cache.get(kunci)`, `cache.delete(kunci)` |
| `cron` | Penjadwal eksekusi tugas berkala | `cron.every("5s", fn)`, `cron.after("10s", fn)`, `cron.stop()` |
| `sql` | Database SQLite bawaan | `sql.open(path)`, `db.query(query, arg)`, `db.execute(query, arg)`, `db.close()` |

---

## Contoh Kode

### 1. HTTP Server Bergaya Bun
```typescript
// server.ts
Kilat.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/status") {
      return Response.json({
        status: "aktif",
        runtime: "Kilat v5.0.0",
        ram: process.memoryUsage()
      });
    }
    return new Response("⚡ Halo dari Kilat Server!");
  }
});

console.log("🚀 Server berjalan di http://localhost:3000");
```

### 2. Database SQLite
```typescript
// db.ts
const db = sql.open("app.db");

db.execute(`
  CREATE TABLE IF NOT EXISTS pengguna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    peran TEXT DEFAULT 'member'
  )
`);

db.execute("INSERT INTO pengguna (nama, peran) VALUES (?, ?)", ["Budi", "admin"]);

const data = db.query("SELECT * FROM pengguna");
console.log("Data Pengguna:", data);
```

### 3. Cache dengan Batas Waktu (TTL)
```typescript
// cache-demo.ts
cache.set("token_auth", { id: 101, user: "admin" }, 120); // 120 detik

const sesi = cache.get("token_auth");
console.log("Sesi Ditemukan:", sesi);
```

### 4. Tugas Berkala (Cron Scheduler)
```typescript
// cron-demo.ts
cron.every("10s", () => {
  log.info("Pengecekan server berkala...");
});

cron.after("30s", () => {
  log.success("Tugas tertunda selesai dijalankan.");
});
```

---

## Template Proyek

Gunakan `kilat create` untuk membuat proyek awal secara instan:

```bash
kilat create vanilla my-app    # Proyek JavaScript sederhana
kilat create react my-app      # Frontend React + Vite
kilat create hono my-app       # Server API kencang berbasis Hono
kilat create vite my-app       # Vite + TypeScript
kilat create api my-app        # Server RESTful API terstruktur
```

---

## Lisensi

Proyek Kilat dilisensikan di bawah [MIT License](LICENSE) © 2026 [ihsannyy](https://github.com/ihsannyy).
