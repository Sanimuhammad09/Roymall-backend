const http = require('http');

async function test() {
  const req = await fetch('http://localhost:4000/api/settings');
  const t = await req.json();
  console.log(t);
}
test();
