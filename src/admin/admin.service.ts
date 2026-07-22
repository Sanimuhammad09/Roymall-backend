import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus, OrderStatus, Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverviewMetrics(startDate?: Date, endDate?: Date) {
    const dateFilter = startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    } : {};

    const [
      revenueResult,
      totalOrders,
      totalCustomers,
      activeAppointments,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Total Revenue
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: dateFilter,
      }),
      // Total Orders
      this.prisma.order.count({ where: dateFilter }),
      // Total Customers
      this.prisma.user.count({ where: { role: Role.CUSTOMER, ...dateFilter } }),
      // Active Appointments
      this.prisma.appointment.count({
        where: {
          status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
          ...dateFilter,
        },
      }),
      // Low Stock Products
      this.prisma.product.findMany({
        where: { stockQuantity: { lt: 10 } },
        select: { id: true, name: true, sku: true, stockQuantity: true },
      }),
      // Recent Orders
      this.prisma.order.findMany({
        where: dateFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return {
      totalRevenue: revenueResult._sum.totalAmount || 0,
      totalOrders,
      totalCustomers,
      activeAppointments,
      lowStockProducts,
      recentOrders,
    };
  }
}
