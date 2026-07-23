import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Roymall API is running!';
  }

  async getMetrics() {
    // 1. Calculate scents delivered based on orders
    const itemsDelivered = await this.prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          status: { not: 'CANCELLED' }
        }
      }
    });
    const scentsDelivered = itemsDelivered._sum.quantity || 0;

    // 2. Global Stockists based on user registrations (or stockists, depending on business logic)
    const globalStockists = await this.prisma.user.count();

    // 3. Customer Rating (Dynamic from real reviews)
    const reviewsAgg = await this.prisma.review.aggregate({
      _avg: { rating: true }
    });
    const customerRating = reviewsAgg._avg.rating ? Math.round(reviewsAgg._avg.rating * 10) / 10 : 0.0;

    return {
      scentsDelivered,
      globalStockists,
      customerRating
    };
  }
}
