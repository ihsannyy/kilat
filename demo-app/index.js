// 🚀 Kilat Project: demo-app
console.log("Hello from Kilat!");

const fs = require('fs');
const os = require('os');

console.log("OS:", os.getenv("OSTYPE") || "unknown");
console.log("Files:", fs.readdirSync("."));
