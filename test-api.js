const http = require('http');

async function test() {
  const tokenReq = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'roymallscents@gmail.com', password: 'password' }) // wait, do we have admin credentials?
  });
  const t = await tokenReq.json();
  console.log(t);
}
test();
