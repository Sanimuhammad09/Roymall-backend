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

    const realScentsDelivered = itemsDelivered._sum.quantity || 0;
    // We add a base of 10,000 for the marketing metric
    const scentsDelivered = 10000 + realScentsDelivered;

    // 2. Global Stockists based on user registrations
    const totalUsers = await this.prisma.user.count();
    // Base 250 + registered users
    const globalStockists = 250 + totalUsers;

    // 3. Customer Rating (Static 4.9 for now, could be dynamic later if a review system is added)
    const customerRating = 4.9;

    return {
      scentsDelivered,
      globalStockists,
      customerRating
    };
  }
}
