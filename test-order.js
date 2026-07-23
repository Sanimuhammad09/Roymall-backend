const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function run() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log("No user found");
  
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'roymall-super-secret-key-2024', { expiresIn: '1d' });
  
  const res = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [],
      subtotal: 100,
      tax: 0,
      shippingCost: 0,
      total: 100,
      shippingAddress: { firstName: 'Test', lastName: 'Test', street: 'Test', city: 'Test', state: 'Test', country: 'Test', zipCode: '000' },
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Order response:", text);
}
run();
