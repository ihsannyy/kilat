var g=Object.create;var d=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var x=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(a){throw t=0,a}};var w=(e,t,a,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of b(t))!v.call(e,n)&&n!==a&&d(e,n,{get:()=>t[n],enumerable:!(o=f(t,n))||o.enumerable});return e};var k=(e,t,a)=>(a=e!=null?g(y(e)):{},w(t||!e||!e.__esModule?d(a,"default",{value:e,enumerable:!0}):a,e));var l=(e,t,a)=>new Promise((o,n)=>{var u=r=>{try{s(a.next(r))}catch(i){n(i)}},h=r=>{try{s(a.throw(r))}catch(i){n(i)}},s=r=>r.done?o(r.value):Promise.resolve(r.value).then(u,h);s((a=a.apply(e,t)).next())});var p=x((I,c)=>{"use strict";c.exports=function(e){return typeof e=="number"?e-e===0:typeof e=="string"&&e.trim()!==""?Number.isFinite?Number.isFinite(+e):isFinite(+e):!1}});var m=k(p());var S=3e3;console.log("\u{1F680} Starting Kilat Demo Web Server...");var T=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u26A1 Kilat Web Server Dashboard</title>
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
      <h1>\u26A1 Kilat Server Dashboard</h1>
      <p class="subtitle">High Performance Ultra-Lightweight JS Runtime Powered by Go</p>
    </header>

    <div class="grid">
      <!-- System Info Card -->
      <div class="card">
        <h2>\u{1F4BB} Informasi Sistem</h2>
        <div id="sys-info">Memuat data sistem...</div>
      </div>

      <!-- Crypto Hash Tool Card -->
      <div class="card">
        <h2>\u{1F510} Crypto Hasher</h2>
        <input type="text" id="hash-input" value="Hello Kilat \u26A1" placeholder="Teks yang akan di-hash">
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
        <h2>\u{1F4C1} Filesystem Explorer</h2>
        <button onclick="loadFiles()">Refresh List File</button>
        <pre id="file-list" style="margin-top:0.75rem;">List file...</pre>
      </div>
    </div>

    <!-- Interactive Shell Command Execution -->
    <div class="card" style="margin-bottom: 2rem;">
      <h2>\u{1F41A} Shell Command Executor ($ API)</h2>
      <div style="display:flex; gap:0.5rem;">
        <input type="text" id="shell-cmd" value="ls -la" placeholder="Masukkan perintah shell (contoh: ls -la)">
        <button style="width:120px;" onclick="runShell()">Eksekusi</button>
      </div>
      <pre id="shell-output" style="margin-top: 1rem; min-height: 100px;">Output perintah shell akan muncul di sini...</pre>
    </div>

    <!-- Package Test Card -->
    <div class="card">
      <h2>\u{1F4E6} NPM Package Tester (is-number)</h2>
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
</html>`,C=Bun.serve({port:S,fetch(e){return l(this,null,function*(){let t=new URL(e.url);if(t.pathname==="/")return new Response(T,{headers:{"Content-Type":"text/html; charset=utf-8"}});if(t.pathname==="/api/info")return new Response(JSON.stringify({platform:os.platform(),arch:os.arch(),cwd:os.cwd(),homedir:os.homedir()}),{headers:{"Content-Type":"application/json"}});if(t.pathname==="/api/hash"){let a=t.searchParams.get("text")||"Kilat",o=t.searchParams.get("algo")||"sha256",n=crypto.createHash(o).update(a).digest("hex");return new Response(JSON.stringify({text:a,algo:o,hash:n}),{headers:{"Content-Type":"application/json"}})}if(t.pathname==="/api/files"){let a=fs.readdirSync(".");return new Response(JSON.stringify({files:a}),{headers:{"Content-Type":"application/json"}})}if(t.pathname==="/api/pkg-test"){let a=t.searchParams.get("value")||"123",o=isNaN(Number(a))?a:Number(a),n=(0,m.default)(o);return new Response(JSON.stringify({value:a,isNumber:n}),{headers:{"Content-Type":"application/json"}})}if(t.pathname==="/api/exec"&&e.method==="POST")try{let o=(yield e.json()).cmd||"ls",n=yield $(o);return new Response(JSON.stringify({output:n.text(),exitCode:n.exitCode}),{headers:{"Content-Type":"application/json"}})}catch(a){return new Response(JSON.stringify({error:String(a)}),{status:500,headers:{"Content-Type":"application/json"}})}return new Response("404 Not Found",{status:404})})}});console.log(`\u2728 Kilat Demo Server running at http://localhost:${C.port}/`);
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
