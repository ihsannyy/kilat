var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

Kilat.serve({
  port: 4000,
  fetch: function(req) {
    var headers = new Headers();
    headers.set('Content-Type', 'text/html');
    return new Response(html, { status: 200, headers: headers });
  }
});

console.log('React app running on http://localhost:4000');
