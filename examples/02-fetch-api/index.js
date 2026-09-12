console.log('=== Fetch API Test ===');
console.log('');

fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(function(res) { return res.json(); })
  .then(function(data) {
    console.log('Title:', data.title);
    console.log('User ID:', data.userId);
    console.log('');
    console.log('=== Done! ===');
  })
  .catch(function(err) {
    console.log('Error:', err);
  });
