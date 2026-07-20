import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalRevenue, ordersCount, customersCount, productsCount] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.productVariant.aggregate({
        _sum: { inventory: true },
      }),
    ]);

    // Calculate previous month stats for comparison
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [lastMonthRevenue, lastMonthOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
      }),
    ]);

    const revenueChange = lastMonthRevenue._sum.totalAmount && totalRevenue._sum.totalAmount
      ? ((totalRevenue._sum.totalAmount - lastMonthRevenue._sum.totalAmount) / lastMonthRevenue._sum.totalAmount) * 100
      : 0;

    const ordersChange = lastMonthOrders
      ? ((ordersCount - lastMonthOrders) / lastMonthOrders) * 100
      : 0;

    return {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      ordersCount,
      customersCount,
      productsInStock: productsCount._sum.inventory || 0,
      revenueChange: revenueChange.toFixed(1),
      ordersChange: ordersChange.toFixed(1),
    };
  }

  async getRevenueData() {
    const now = new Date();
    const months = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const revenue = await this.prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { totalAmount: true },
      });

      months.push({
        name: monthName,
        sales: revenue._sum.totalAmount || 0,
      });
    }

    return months;
  }

  async getRecentOrders() {
    const orders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return orders.map(order => ({
      id: order.orderNumber,
      customer: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
      amount: order.totalAmount,
      status: order.status,
      date: order.createdAt,
    }));
  }

  async getAnalytics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      currentMonthRevenue,
      lastMonthRevenue,
      currentMonthOrders,
      lastMonthOrders,
      currentMonthCustomers,
      lastMonthCustomers,
      topProducts,
      orderStatusBreakdown,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      this.prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ['variantId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        return {
          productName: variant?.product.name || 'Unknown',
          color: variant?.color || 'Unknown',
          size: variant?.size || 'Unknown',
          quantity: item._sum.quantity,
        };
      }),
    );

    const revenueGrowth = lastMonthRevenue._sum.totalAmount && currentMonthRevenue._sum.totalAmount
      ? ((currentMonthRevenue._sum.totalAmount - lastMonthRevenue._sum.totalAmount) / lastMonthRevenue._sum.totalAmount) * 100
      : 0;

    const ordersGrowth = lastMonthOrders
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0;

    const customersGrowth = lastMonthCustomers
      ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0;

    return {
      revenue: {
        current: currentMonthRevenue._sum.totalAmount || 0,
        previous: lastMonthRevenue._sum.totalAmount || 0,
        growth: revenueGrowth.toFixed(1),
        orders: currentMonthRevenue._count,
      },
      orders: {
        current: currentMonthOrders,
        previous: lastMonthOrders,
        growth: ordersGrowth.toFixed(1),
      },
      customers: {
        current: currentMonthCustomers,
        previous: lastMonthCustomers,
        growth: customersGrowth.toFixed(1),
      },
      topProducts: topProductDetails,
      orderStatusBreakdown: orderStatusBreakdown.map(item => ({
        status: item.status,
        count: item._count,
      })),
    };
  }
}
