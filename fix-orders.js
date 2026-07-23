const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const result = await prisma.order.updateMany({
    where: { userId: null },
    data: { userId: 'db107fca-964a-4d3f-abbe-089ba971fa05' }
  });
  console.log("Updated orders:", result.count);
}
run();
