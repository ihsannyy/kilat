var requestCount = 0;
var startTime = Date.now();

function jsonResponse(obj) {
  var body = JSON.stringify(obj, null, 2);
  var headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return new Response(body, { status: 200, headers: headers });
}

Kilat.serve({
  port: 3000,
  fetch: function(req) {
    requestCount++;
    var url = new URL(req.url);
    var path = url.pathname;

    if (path === '/') {
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kilat API</title></head><body style="font-family:system-ui;background:#0a0a0a;color:#e2e8f0;padding:40px"><h1>Kilat API Server</h1><p>v4.0.0</p><ul><li><a href="/api/time">/api/time</a></li><li><a href="/api/stats">/api/stats</a></li><li><a href="/api/echo?msg=hello">/api/echo?msg=hello</a></li></ul></body></html>';
      var h = new Headers();
      h.set('Content-Type', 'text/html');
      return new Response(html, { status: 200, headers: h });
    }

    if (path === '/api/time') {
      return jsonResponse({ time: new Date().toISOString() });
    }

    if (path === '/api/stats') {
      var uptime = Math.floor((Date.now() - startTime) / 1000);
      return jsonResponse({ requests: requestCount, uptime: uptime });
    }

    if (path === '/api/echo') {
      var params = {};
      url.searchParams.forEach(function(v, k) { params[k] = v; });
      return jsonResponse({ echo: params });
    }

    return jsonResponse({ error: 'Not found' });
  }
});

console.log('Server running on http://localhost:3000');
