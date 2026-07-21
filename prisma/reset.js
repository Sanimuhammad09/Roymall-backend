const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDB() {
  console.log('Deleting all dependencies and products...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  console.log('Database cleanly wiped.');
}

resetDB()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
