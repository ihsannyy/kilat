const result = net.fetch("https://jsonplaceholder.typicode.com/posts/1");
console.log("Status:", result.status);
console.log("Body:", result.body);