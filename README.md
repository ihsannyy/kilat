<div align="center">

<img src="docs/kilat.png" alt="Kilat Logo" width="140"/>

# KILAT

**The ultra-lightweight JavaScript & TypeScript runtime engineered for Termux, Linux, and resource-constrained environments.**

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

## Overview

Modern JavaScript runtimes like Node.js and Bun are fast on powerful developer workstations, but they struggle in resource-constrained environments like **Android (Termux)**, Raspberry Pis, embedded Linux boards, and low-spec cloud VPS:

- **Node.js**: Suffers from heavy cold-start latency (35-100ms+), high idle memory footprint (~31MB), and disk-eating `node_modules` duplication across projects.
- **Bun**: Built for x86/ARM servers, but does not natively run on Android/Termux without complex `proot` glibc workarounds.
- **Kilat**: Written from the ground up in **Go + Goja**. It ships as a single static binary with **zero external dependencies**, cold starts in **~2ms**, idles at only **~8MB RAM**, compiles TypeScript instantly in memory, and stores packages in a shared global cache (`~/.kilat/packages/`).

---

## Benchmarks

Measured on an Android ARM64 Termux environment:

| Metric | Node.js v20 | Bun v1.1 (proot) | Kilat v5.0.0 |
|:---|:---:|:---:|:---:|
| **Cold Start Latency** | ~38 ms | ~18 ms | **~2 ms** *(19x faster)* |
| **Idle Memory (RSS)** | ~31 MB | ~28 MB | **~8 MB** *(4x lighter)* |
| **Storage (10 Projects)** | ~1.2 GB | ~850 MB | **0 MB** *(Global Cache)* |
| **TypeScript / TSX** | Requires setup / build | Built-in | **Built-in (Zero Config)** |
| **Native Termux Support** | Via heavy apt pkg | Unsupported (needs proot) | **Native Single Binary** |
| **Built-in SQLite** | External npm pkg | Built-in | **Built-in (`sql`)** |
| **Built-in Task Scheduler** | External npm pkg | External npm pkg | **Built-in (`cron`)** |
| **Built-in In-Memory Cache** | External npm pkg | External npm pkg | **Built-in (`cache`)** |

---

## Features

- ⚡ **Sub-2ms Cold Starts** — Executes CLI scripts and handlers instantly without V8 JIT warmup overhead.
- 🪶 **~8MB Memory Footprint** — Smoothly runs on 512MB RAM VPS, Raspberry Pis, and smartphones.
- 📦 **Zero-Duplication Global Cache** — Packages installed via `kilat add` are cached globally in `~/.kilat/packages/`. 10 projects consume 0 duplicated disk space.
- 🔷 **Native TypeScript & TSX** — Direct execution of `.ts`, `.tsx`, `.js`, and `.jsx` without `tsconfig.json` or external transpilers.
- 🌐 **Bun-Style HTTP Server** — High-throughput web server via `Kilat.serve()` powered by Go's native HTTP stack.
- 💾 **Embedded SQLite Database** — Out-of-the-box SQLite with prepared statements and query execution via `sql`.
- ⏱️ **Integrated TTL Cache & Cron** — Native in-memory caching (`cache`) and task scheduling (`cron`) without npm dependencies.
- 🐚 **Goroutine-Powered Shell Exec** — Run shell commands asynchronously with `$()` backed by Go goroutines.
- 🛠️ **Full Developer Tooling** — Bundler & minifier (`kilat build`), project scaffolding (`kilat create`), interactive REPL, and file watcher (`--watch`).

---

## Installation

### Automated Install (Termux, Linux, macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash
```

### Pre-built Binaries

Download pre-compiled standalone binaries directly from [GitHub Releases](https://github.com/ihsannyy/kilat/releases) for:
- Linux (`amd64`, `arm64`)
- Android / Termux (`arm64`, `amd64`)
- macOS (`Apple Silicon arm64`, `Intel amd64`)
- Windows (`amd64`)

### Build from Source

Requirements: Go 1.21 or newer.

```bash
git clone https://github.com/ihsannyy/kilat.git
cd kilat
go build -o kilat ./cmd/kilat
# Optional: move to PATH
cp kilat $PREFIX/bin/   # On Termux
# or
sudo mv kilat /usr/local/bin/   # On Linux / macOS
```

---

## CLI Reference

```
Usage: kilat <command> [options]

Commands:
  run <file> [--watch]       Execute a JavaScript or TypeScript file
  start                      Execute the "start" script from package.json or index.ts/js
  create <template> [name]   Scaffold a new project from pre-configured templates
  add <package>              Install a package into the global package cache
  remove <package>           Remove a package from the global package cache
  build <input> <output>     Bundle and minify TypeScript/JavaScript into a single bundle
  repl                       Start an interactive JavaScript REPL session
  init [-y]                  Initialize a new package.json in the current directory
  info                       Display runtime diagnostics, platform info, and cache paths

Flags:
  --version, -v              Print Kilat version
  --update                   Check and update Kilat to the latest release
  --watch, -w                Enable live reload on file modifications
```

---

## Built-in Standard Library (15 Modules)

Kilat includes a rich set of native modules built directly in Go—no external npm downloads required:

| Module | Purpose | Key Methods / Capabilities |
|:---|:---|:---|
| `fs` | File system operations | `readFile`, `readFileSync`, `writeFile`, `writeFileSync`, `readdir`, `stat`, `existsSync` |
| `os` | System diagnostics | `platform()`, `arch()`, `cpus()`, `totalmem()`, `freemem()`, `homedir()`, `hostname()` |
| `path` | Path utilities | `join()`, `resolve()`, `basename()`, `dirname()`, `extname()` |
| `crypto` | Cryptography & hashing | `randomBytes()`, `createHash()`, `md5()`, `sha256()`, `uuid()` |
| `child_process` | Process execution | `exec()`, `execSync()`, `spawn()` |
| `buffer` | Binary data handling | `Buffer.from()`, `Buffer.alloc()`, `Buffer.concat()` |
| `stream` | Stream pipelines | `Readable`, `Writable`, `Transform` |
| `timers` | Async scheduling | `setTimeout()`, `clearTimeout()`, `setInterval()`, `clearInterval()` |
| `websocket` | Real-time networking | Native WebSocket client with `open`, `message`, `close` event listeners |
| `net` | Network utilities | TCP sockets, HTTP networking |
| `log` | Structured colored logging | `log.info()`, `log.warn()`, `log.error()`, `log.debug()`, `log.success()` |
| `events` | Event pub/sub | `EventEmitter` with `on()`, `once()`, `emit()`, `off()` |
| `cache` | In-memory TTL cache | `cache.set(key, val, ttlSec)`, `cache.get(key)`, `cache.delete(key)`, `cache.has(key)` |
| `cron` | Task scheduler | `cron.every("5s", fn)`, `cron.after("10s", fn)`, `cron.stop()` |
| `sql` | SQLite database | `sql.open(path)`, `db.query(sql, args)`, `db.execute(sql, args)`, `db.close()` |

### Global Runtime APIs
- `Kilat.serve({ port, fetch })` — High-performance HTTP server
- `fetch(url, options)` — Web-standard Promise-based HTTP fetch
- `$('<command>')` — Asynchronous shell command execution powered by Go goroutines
- `console` — Formatted logging (`log`, `info`, `warn`, `error`, `time`, `timeEnd`)
- `TextEncoder` & `TextDecoder` — UTF-8 binary encoding
- `atob()` & `btoa()` — Base64 string encoder/decoder
- `process` — Environment variables (`process.env`), `process.argv`, `process.cwd()`, `process.exit()`

---

## Code Examples

### 1. Bun-Style High Throughput HTTP Server
```typescript
// server.ts
Kilat.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") {
      return Response.json({
        status: "healthy",
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    }
    return new Response("⚡ Running on Kilat v5.0.0!");
  }
});

console.log("🚀 Server listening on http://localhost:3000");
```

### 2. Embedded SQLite Database
```typescript
// db.ts
const db = sql.open("app.db");

db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'developer'
  )
`);

db.execute("INSERT INTO users (name, role) VALUES (?, ?)", ["Ihsan", "maintainer"]);

const users = db.query("SELECT * FROM users");
console.log("Database Records:", users);
```

### 3. In-Memory TTL Cache
```typescript
// cache-demo.ts
// Store session token with a 60-second TTL
cache.set("session:usr_481", { user: "alice", role: "admin" }, 60);

const session = cache.get("session:usr_481");
console.log("Active Session:", session);

console.log("Cache has key?", cache.has("session:usr_481")); // true
```

### 4. Background Scheduled Tasks (Cron)
```typescript
// scheduler.ts
cron.every("5s", () => {
  log.debug("Heartbeat pulse: system normal");
});

cron.after("15s", () => {
  log.info("Delayed 15-second maintenance routine initiated");
});
```

### 5. Asynchronous Shell Goroutines ($)
```typescript
// shell.ts
const branch = await $('git rev-parse --abbrev-ref HEAD');
const commit = await $('git rev-parse --short HEAD');

log.success(`Active Git State: ${branch.trim()} @ ${commit.trim()}`);
```

---

## Scaffolding Templates

Kickstart projects instantly with `kilat create`:

```bash
kilat create vanilla my-app    # Minimalist JavaScript project
kilat create react my-app      # React + Vite frontend
kilat create hono my-app       # High-performance Hono API server
kilat create vite my-app       # Vite + TypeScript application
kilat create api my-app        # Structured RESTful API server
```

---

## Project Architecture

```
kilat/
├── cmd/kilat/               # CLI entrypoint & subcommands
├── internal/
│   ├── engine/              # Goja ECMAScript engine & in-memory esbuild transpiler
│   ├── modules/             # 15 Native standard modules (fs, sql, cache, cron, etc.)
│   ├── pkgmanager/          # Global cache manager (~/.kilat/packages/)
│   ├── initcmd/             # Package initialization logic
│   ├── createcmd/           # Scaffolding templates engine
│   ├── repl/                # Interactive JavaScript REPL
│   └── utils/               # HTTP client, self-updater, telemetry helpers
├── website/                 # Official documentation & landing page
├── install.sh               # Cross-platform installation script
└── go.mod
```

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/cool-feature`)
3. Commit your changes (`git commit -m 'feat: add cool feature'`)
4. Push to the branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

---

## License

Kilat is licensed under the [MIT License](LICENSE) © 2026 [ihsannyy](https://github.com/ihsannyy).
