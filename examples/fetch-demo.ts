console.log("Testing Global fetch() API...");

(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  console.log("Fetch Status:", res.status);
  const text = await res.text();
  console.log("Fetch Body:", text);
})().catch(err => {
  console.log("Promise Error:", err.stack || err);
});
