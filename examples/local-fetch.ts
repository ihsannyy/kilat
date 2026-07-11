console.log("Starting local serve and fetch test...");

const server = Bun.serve({
  port: 8080,
  fetch(req) {
    return new Response("Hello from local server!");
  }
});

(async () => {
  const res = await fetch("http://localhost:8080/");
  console.log("Fetch Status:", res.status);
  const text = await res.text();
  console.log("Fetch Body:", text);
})().catch(err => {
  console.error("Local fetch error:", err);
}).finally(() => {
  console.log("Stopping server...");
  server.stop();
});
