# 📝 Changelog

Semua pembaruan penting untuk proyek **Kilat** akan didokumentasikan di berkas ini.

---

## [v0.4.0] - 2026-06-20
### ⚡ Fitur Baru
* **Built-in HTTP Server (`Bun.serve`-like API)**: Server HTTP internal performa tinggi yang efisien menggunakan objek global `Bun.serve` untuk menangani routing dan request/response.
* **Dukungan Fetch API Dasar**: Global class `Request`, `Response`, dan `Headers` yang kompatibel dengan Fetch API untuk mempermudah manipulasi HTTP request dan response.
* **REPL & Event-loop Integrasi**: REPL interaktif yang sepenuhnya asinkron berbasis event-loop sehingga server HTTP atau promise dapat berjalan di background saat REPL sedang menunggu input pengguna.

## [v0.3.0] - 2026-06-19
### ⚡ Fitur Baru
* **REPL Interaktif (Interactive Shell)**: Menjalankan runtime `kilat` tanpa argumen atau `kilat repl` akan meluncurkan interpreter interaktif JavaScript di terminal.
* **Global Require di REPL**: Dukungan penuh pemanggilan `require()` untuk modul lokal maupun built-in langsung dari konsol REPL.

## [v0.2.0] - 2026-06-19
### ⚡ Fitur Baru
* **Watch Mode (`--watch` / `-w`)**: Mengizinkan auto-reload runtime saat ada perubahan berkas `.js` atau `.json` di direktori proyek.
  * Jalankan dengan: `kilat run index.js --watch` atau `kilat run index.js -w`.
* **Auto Pemuatan File `.env`**: Kilat secara otomatis mencari, mengurai (parse), dan menyuntikkan variabel dari berkas `.env` di direktori aktif ke dalam environment variables saat startup runtime.
  * Dapat dibaca via `os.getenv("VARIABLE_NAME")`.

### 📦 CommonJS Loader & Module Scope
* **CJS Wrapping**: Pembungkusan kode JavaScript dengan standard module wrapper `(function(exports, require, module, __filename, __dirname) { ... })` agar variable antar file tidak bocor ke global scope.
* **Relative Path Loading**: Pemuatan modul menggunakan local relative path (`require('./helper')` atau `require('../config')`).
* **JSON File Loading**: Mengimpor berkas `.json` secara langsung menggunakan `require()`.
* **Built-in Module Interception**: Panggilan `require('os')`, `require('fs')`, `require('net')`, dan `require('console')` diarahkan otomatis ke modul bawaan internal.

### 🔧 Perbaikan & Peningkatan
* **Repository Fix**: Memperbaiki berkas `.gitignore` agar biner rilis `/kilat` tidak menyembunyikan direktori source code `cmd/kilat/`.
* **Auto-deploy Metadata**: Integrasi Open Graph image preview (`kilat.jpg`) untuk metadata link preview website.
* **Responsive Website**: Desain web dokumentasi disempurnakan agar sepenuhnya responsif pada perangkat mobile (Termux screen size).

---

## [v0.1.0] - 2026-06-19
### ⚡ Rilis Awal (Initial Release)
* **Goja JavaScript Engine**: Pemuatan runtime berbasis Goja (interpreter JavaScript murni dalam bahasa Go) yang ringan untuk Termux Android.
* **Centralized Package Manager**: Perintah `kilat add <package>` mengunduh paket npm terpusat ke direktori global `~/.kilat/packages/` untuk menghemat memori penyimpanan.
* **Built-in Core Modules**:
  * `console` (logging berwarna)
  * `fs` (file system sinkron)
  * `net` (HTTP client `fetch`)
  * `os` (akses OS, argumen CLI, environment)
* **Interactive Project Init**: Perintah `kilat init` untuk membuat berkas `package.json` secara interaktif di terminal.
