<div align="center">

# KILAT

### Runtime JavaScript buat Termux & Linux

<img src="docs/kilat.png" alt="Kilat" width="400"/>

Buat kamu yang males nunggu Node.js startup lama. Kilat alternatif yang ringan, cepat, gak ribet.

</div>

---

## Kenapa Kilat?

Node.js berat. V8 makan RAM banyak, `node_modules` duplikat tiap proyek, startup lambat. Kilat beda.

| | Node.js v20 | Kilat v5.0.0 |
|--|-------------|--------------|
| Startup | ~38ms | ~2ms |
| RAM | ~31MB | ~8MB |
| Storage | ~120MB/project | 0 (global cache) |
| TypeScript | Perlu setup | Built-in |

---

## Fitur

- **Startup cepat** — 2ms, enggak pakai V8
- **Global cache** — Package disimpan di `~/.kilat/packages/`, hemat storage
- **TypeScript built-in** — `.ts` langsung jalan, gak perlu ts-node
- **Fetch API** — Request HTTP async
- **Kilat.serve** — Bikin HTTP server
- **Package manager** — `kilat add`, `kilat remove`
- **Template system** — `kilat create` buat scaffolding
- **Watch mode** — Auto-restart kalau file berubah

---

## Instalasi

### Pakai Script (Recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash
```

### Build Sendiri
```bash
git clone https://github.com/ihsannyy/kilat
cd kilat
go build -o kilat ./cmd/kilat
cp kilat $PREFIX/bin/
```

---

## Commands

```
kilat init      Inisialisasi project
kilat create    Bikin project dari template
kilat run       Jalankan file JS/TS
kilat start     Jalankan script start
kilat add       Install package
kilat remove    Hapus package
kilat build     Bundle & minify
kilat repl      REPL interaktif
kilat info      Info runtime
```

### Flags
```
--version    Versi Kilat
--update     Update ke versi terbaru
--watch      Auto-restart
-y           Auto-yes (init)
```

---

## Templates

```bash
kilat create vanilla     # Plain JavaScript
kilat create react       # React + Vite
kilat create hono        # Hono web server
kilat create vite        # Vite + vanilla TS
kilat create api         # REST API server
```

Contoh:
```bash
kilat create hono my-api
cd my-api
kilat run src/index.js
```

---

## Built-in Modules

| Module | Fungsi |
|--------|--------|
| `fs` | Baca/tulis file |
| `os` | Info sistem |
| `path` | Manipulasi path |
| `crypto` | Hashing, encrypt |
| `child_process` | Jalankan shell command |
| `buffer` | Data biner |
| `stream` | Stream processing |
| `timers` | setTimeout/setInterval |
| `websocket` | WebSocket client |
| `net` | HTTP fetch |
| `log` | Structured logging |
| `events` | Simple pub/sub |
| `cache` | Key-value cache |
| `cron` | Scheduled tasks |
| `sql` | SQLite database |

### Global API
- `fetch()` — HTTP request
- `Kilat.serve()` — Bikin server
- `console` — Logging
- `TextEncoder` / `TextDecoder`
- `atob()` / `btoa()`
- `process` — cwd, pid, exit

---

## Contoh

### Hello World
```javascript
console.log("Hello dari Kilat!");

const os = require('os');
console.log("Platform:", os.platform());
```

### HTTP Server
```javascript
Kilat.serve({
  port: 3000,
  fetch: function(req) {
    return new Response("Hello!");
  }
});
```

### Fetch Data
```javascript
fetch('https://api.github.com/users/ihsannyy')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Database
```javascript
const db = sql.open("app.db");
db.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
db.execute("INSERT INTO users (name) VALUES (?)", ["Budi"]);
const users = db.query("SELECT * FROM users");
```

### Logging
```javascript
log.info("Server started on port 3000");
log.error("Failed to connect:", err);
log.warn("Low memory");
log.debug("Debug info");
```

### Cache
```javascript
cache.set("token", "abc123", 3600); // TTL 1 jam
const token = cache.get("token");
```

### Events
```javascript
events.on("data", (msg) => log.info(msg));
events.emit("data", "Hello");
```

### Cron
```javascript
cron.every("5s", () => log.debug("heartbeat"));
cron.after("10s", () => log.info("delayed task"));
```

---

## Examples

Contoh lengkap di folder [`examples/`](./examples):

| Folder | Isi |
|--------|-----|
| `01-hello` | Basic script |
| `02-fetch-api` | HTTP requests |
| `03-web-server` | REST API |
| `04-react-app` | React + Tailwind |
| `05-hono-api` | Hono framework |

```bash
cd examples/03-web-server
kilat run server.js
```

---

## Struktur Project

```
kilat/
├── cmd/kilat/main.go        # CLI
├── internal/
│   ├── engine/              # Goja runtime
│   ├── modules/             # Built-in modules
│   ├── pkgmanager/          # Package manager
│   ├── initcmd/             # kilat init
│   ├── createcmd/           # kilat create
│   ├── repl/                # REPL
│   └── utils/               # Utilities
├── examples/                # Contoh project
├── website/                 # Dokumentasi
├── install.sh               # Install script
└── go.mod
```

---

## Kontribusi

Silakan Fork, ubah, kirim PR. Kalau ada bug atau fitur baru, langsung aja.

```bash
git clone https://github.com/ihsannyy/kilat
cd kilat
go build -o kilat ./cmd/kilat
```

---

## Lisensi

MIT License © 2026 [ihsannyy](https://github.com/ihsannyy)
