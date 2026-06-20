const server = Bun.serve({
  port: 3000,
  fetch(req) {
    console.log(`[Request] ${req.method} ${req.url}`);
    return new Response(`Hello World from Kilat v0.4.0 HTTP Server! Method: ${req.method}`, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "X-Powered-By": "Kilat"
      }
    });
  }
});

console.log(`Server running at http://localhost:${server.port}/`);
