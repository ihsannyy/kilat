const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    console.log(`[Request] ${req.method} ${req.url}`);
    
    // Simulate some async processing using a Promise
    const responseBody = await new Promise(resolve => {
      resolve("Hello from async/await fetch!");
    });
    
    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
});

console.log(`Async server running at http://localhost:${server.port}/`);
