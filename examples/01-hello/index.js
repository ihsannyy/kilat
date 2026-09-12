var os = require('os');
var fs = require('fs');

console.log('=== Hello from Kilat v4.0.0 ===');
console.log('');
console.log('Platform:', os.platform());
console.log('Arch:', os.arch());
console.log('');

console.log('=== File Read ===');
var content = fs.readFileSync('package.json', 'utf8');
console.log('package.json:', content.length, 'bytes');
console.log('');

console.log('=== String Ops ===');
var str = 'Kilat Runtime';
console.log('Upper:', str.toUpperCase());
console.log('Split:', str.split(' ').join('-'));
