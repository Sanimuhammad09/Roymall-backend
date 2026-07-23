const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function run() {
  const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!user) return console.log("No admin found");
  
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'roymall-super-secret-key-2024', { expiresIn: '1d' });
  
  // Test local backend
  const resLocal = await fetch('http://localhost:3000/api/admin/analytics/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Local response:", await resLocal.text());

  // Test Railway backend
  const resRemote = await fetch('https://roymall-backend-production.up.railway.app/api/admin/analytics/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Remote response:", await resRemote.text());
}
run();
