import isNumber from "is-number";

const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

const PORT = 3000;

console.log("🚀 Starting Kilat Demo Web Server...");

const HTML_DASHBOARD = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ Kilat Web Server Dashboard</title>
  <style>
    :root {
      --bg: #0b0d14;
      --card-bg: #141724;
      --card-border: #222738;
      --accent: #00f2fe;
      --accent-grad: linear-gradient(135deg, #00c6ff, #0072ff);
      --text: #f0f4f8;
      --text-muted: #8a99ad;
      --success: #00e676;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 2rem; min-height: 100vh; }
    .container { max-width: 960px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 2.5rem; }
    h1 { font-size: 2.5rem; background: linear-gradient(90deg, #00f2fe, #4facfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.subtitle { color: var(--text-muted); margin-top: 0.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .card h2 { font-size: 1.2rem; margin-bottom: 1rem; color: var(--accent); display: flex; align-items: center; gap: 0.5rem; }
    pre, code { background: #08090d; border-radius: 6px; padding: 0.75rem; font-family: monospace; font-size: 0.9rem; overflow-x: auto; color: #64ffda; }
    input, button, select { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--card-border); background: #08090d; color: var(--text); margin-top: 0.5rem; font-size: 0.95rem; }
    button { background: var(--accent-grad); color: #fff; font-weight: bold; border: none; cursor: pointer; transition: transform 0.2s, opacity 0.2s; }
    button:hover { opacity: 0.9; transform: translateY(-2px); }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(0, 242, 254, 0.15); color: var(--accent); font-size: 0.8rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⚡ Kilat Server Dashboard</h1>
      <p class="subtitle">High Performance Ultra-Lightweight JS Runtime Powered by Go</p>
    </header>

    <div class="grid">
      <!-- System Info Card -->
      <div class="card">
        <h2>💻 Informasi Sistem</h2>
        <div id="sys-info">Memuat data sistem...</div>
      </div>

      <!-- Crypto Hash Tool Card -->
      <div class="card">
        <h2>🔐 Crypto Hasher</h2>
        <input type="text" id="hash-input" value="Hello Kilat ⚡" placeholder="Teks yang akan di-hash">
        <select id="hash-algo">
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
          <option value="md5">MD5</option>
          <option value="sha1">SHA-1</option>
        </select>
        <button onclick="generateHash()">Generate Hash</button>
        <pre id="hash-output" style="margin-top:0.75rem;">Hasil hash akan muncul di sini</pre>
      </div>

      <!-- File Manager Card -->
      <div class="card">
        <h2>📁 Filesystem Explorer</h2>
        <button onclick="loadFiles()">Refresh List File</button>
        <pre id="file-list" style="margin-top:0.75rem;">List file...</pre>
      </div>
    </div>

    <!-- Interactive Shell Command Execution -->
    <div class="card" style="margin-bottom: 2rem;">
      <h2>🐚 Shell Command Executor ($ API)</h2>
      <div style="display:flex; gap:0.5rem;">
        <input type="text" id="shell-cmd" value="ls -la" placeholder="Masukkan perintah shell (contoh: ls -la)">
        <button style="width:120px;" onclick="runShell()">Eksekusi</button>
      </div>
      <pre id="shell-output" style="margin-top: 1rem; min-height: 100px;">Output perintah shell akan muncul di sini...</pre>
    </div>

    <!-- Package Test Card -->
    <div class="card">
      <h2>📦 NPM Package Tester (is-number)</h2>
      <input type="text" id="pkg-input" value="123.45" placeholder="Masukkan nilai...">
      <button onclick="testPkg()">Uji isNumber()</button>
      <pre id="pkg-output" style="margin-top:0.75rem;">Hasil pengujian package...</pre>
    </div>
  </div>

  <script>
    async function fetchSysInfo() {
      const res = await fetch('/api/info');
      const data = await res.json();
      document.getElementById('sys-info').innerHTML = \`
        <p style="margin-bottom:0.4rem;">Platform: <span class="badge">\${data.platform}</span></p>
        <p style="margin-bottom:0.4rem;">Arch: <span class="badge">\${data.arch}</span></p>
        <p style="margin-bottom:0.4rem;">CWD: <code>\${data.cwd}</code></p>
        <p style="margin-bottom:0.4rem;">Home: <code>\${data.homedir}</code></p>
        <p>Memory Usage: <span class="badge" style="background:rgba(0,230,118,0.15); color:var(--success);">Super Low (~8MB)</span></p>
      \`;
    }

    async function generateHash() {
      const text = document.getElementById('hash-input').value;
      const algo = document.getElementById('hash-algo').value;
      const res = await fetch(\`/api/hash?text=\${encodeURIComponent(text)}&algo=\${algo}\`);
      const data = await res.json();
      document.getElementById('hash-output').innerText = data.hash;
    }

    async function loadFiles() {
      const res = await fetch('/api/files');
      const data = await res.json();
      document.getElementById('file-list').innerText = JSON.stringify(data.files, null, 2);
    }

    async function runShell() {
      const cmd = document.getElementById('shell-cmd').value;
      document.getElementById('shell-output').innerText = "Menjalankan perintah...";
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cmd })
      });
      const data = await res.json();
      document.getElementById('shell-output').innerText = data.output || data.error;
    }

    async function testPkg() {
      const val = document.getElementById('pkg-input').value;
      const res = await fetch(\`/api/pkg-test?value=\${encodeURIComponent(val)}\`);
      const data = await res.json();
      document.getElementById('pkg-output').innerText = \`Nilai "\${val}" isNumber: \${data.isNumber}\`;
    }

    fetchSysInfo();
    loadFiles();
  </script>
</body>
</html>`;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Route: HTML Dashboard
    if (url.pathname === "/") {
      return new Response(HTML_DASHBOARD, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // Route: API System Info
    if (url.pathname === "/api/info") {
      return new Response(JSON.stringify({
        platform: os.platform(),
        arch: os.arch(),
        cwd: os.cwd(),
        homedir: os.homedir()
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Route: API Crypto Hashing
    if (url.pathname === "/api/hash") {
      const text = url.searchParams.get("text") || "Kilat";
      const algo = url.searchParams.get("algo") || "sha256";
      const hashVal = crypto.createHash(algo).update(text).digest("hex");
      return new Response(JSON.stringify({ text, algo, hash: hashVal }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Route: API Filesystem
    if (url.pathname === "/api/files") {
      const files = fs.readdirSync(".");
      return new Response(JSON.stringify({ files }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Route: API Package Test (is-number)
    if (url.pathname === "/api/pkg-test") {
      const value = url.searchParams.get("value") || "123";
      const parsedVal = !isNaN(Number(value)) ? Number(value) : value;
      const result = isNumber(parsedVal);
      return new Response(JSON.stringify({ value, isNumber: result }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Route: API Shell Command Execution ($ API)
    if (url.pathname === "/api/exec" && req.method === "POST") {
      try {
        const body = await req.json();
        const cmdStr = body.cmd || "ls";
        const result = await $(cmdStr);
        return new Response(JSON.stringify({ output: result.text(), exitCode: result.exitCode }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("404 Not Found", { status: 404 });
  }
});

console.log(`✨ Kilat Demo Server running at http://localhost:${server.port}/`);
