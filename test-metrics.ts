import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const itemsDelivered = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: {
      order: {
        status: { not: 'CANCELLED' }
      }
    }
  });
  const globalStockists = await prisma.user.count();
  const reviewsAgg = await prisma.review.aggregate({
    _avg: { rating: true }
  });
  console.log({
    scentsDelivered: itemsDelivered._sum.quantity || 0,
    globalStockists,
    customerRating: reviewsAgg._avg.rating || 0
  });
}
main().finally(() => prisma.$disconnect());
