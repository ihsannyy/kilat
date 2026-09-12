var requestCount = 0;
var startTime = Date.now();

function jsonResponse(obj) {
  var body = JSON.stringify(obj);
  var headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return new Response(body, { status: 200, headers: headers });
}

var routes = {
  '/api/time': function(req) {
    return jsonResponse({ time: new Date().toISOString() });
  },
  '/api/echo': function(req) {
    var url = new URL(req.url);
    var params = {};
    url.searchParams.forEach(function(v, k) { params[k] = v; });
    return jsonResponse({ echo: params });
  },
  '/api/stats': function(req) {
    var uptime = Math.floor((Date.now() - startTime) / 1000);
    return jsonResponse({ requests: requestCount, uptime: uptime });
  }
};

Kilat.serve({
  port: 3000,
  fetch: function(req) {
    requestCount++;
    var url = new URL(req.url);
    var path = url.pathname;

    if (path === '/' || path === '/index.html') {
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kilat API</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui;background:#0a0a0a;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:60px 20px}h1{font-size:32px;font-weight:800;letter-spacing:-.03em;margin-bottom:6px;background:linear-gradient(135deg,#6366f1,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.sub{color:#64748b;font-size:13px;margin-bottom:36px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;max-width:700px;width:100%}.c{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:20px}.c:hover{border-color:rgba(255,255,255,.12)}.c h3{font-family:monospace;font-size:12px;color:#22d3ee;margin-bottom:6px}.c p{font-size:12px;color:#94a3b8;line-height:1.5}.c pre{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.04);border-radius:5px;padding:10px;margin-top:10px;font-size:11px;color:#94a3b8;overflow-x:auto}.st{margin-top:32px;padding:12px 20px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.2);border-radius:6px;font-size:12px;color:#34d399}</style></head><body><h1>Kilat API Server</h1><p class="sub">v4.0.0</p><div class="cards"><div class="c"><h3>GET /api/time</h3><p>Returns current server time</p><pre>{"time":"2026-09-12T10:00:00Z"}</pre></div><div class="c"><h3>GET /api/echo</h3><p>Echo back query params</p><pre>{"echo":{"msg":"hello"}}</pre></div><div class="c"><h3>GET /api/stats</h3><p>Server runtime stats</p><pre>{"requests":42,"uptime":120}</pre></div><div class="c"><h3>GET /api/files</h3><p>List current directory</p><pre>{"files":["server.js","node_modules"]}</pre></div></div><div class="st" id="st">Loading...</div><script>fetch("/api/stats").then(function(r){return r.json()}).then(function(d){document.getElementById("st").textContent="Uptime: "+d.uptime+"s | Requests: "+d.requests})</script></body></html>';
      var headers = new Headers();
      headers.set('Content-Type', 'text/html');
      return new Response(html, { status: 200, headers: headers });
    }

    if (path === '/api/files') {
      var fs = require('fs');
      var files = fs.readdirSync('.');
      return jsonResponse({ files: files });
    }

    if (routes[path]) {
      return routes[path](req);
    }

    return jsonResponse({ error: 'Not found' });
  }
});

console.log('Server running on http://localhost:3000');
