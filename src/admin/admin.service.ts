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

  async getSettings() {
    let settings = await this.prisma.storeSetting.findFirst();
    
    if (!settings) {
      settings = await this.prisma.storeSetting.create({
        data: {
          storeName: 'Roymall Scents',
          supportEmail: 'support@roymallscents.com',
          contactPhone: '+234 123 4567 890',
          storeAddress: '123 Fragrance Lane, Lagos',
          taxRate: 7.5,
          currency: 'NGN',
          enablePromotions: true,
          promoBannerText: 'Enjoy 20% off all Oud collections this week!',
          stripePublicKey: '',
          stripeSecretKey: '',
          paypalClientId: '',
          paymentMinTrans: 2500,
          paymentMaxTrans: 5000000,
          paymentServiceFee: 0,
        },
      });
    }

    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    
    return this.prisma.storeSetting.update({
      where: { id: settings.id },
      data,
    });
  }

  // --- Shipping Zones ---
  async getShippingZones() {
    return this.prisma.shippingZone.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createShippingZone(data: any) {
    return this.prisma.shippingZone.create({ data });
  }

  async updateShippingZone(id: string, data: any) {
    return this.prisma.shippingZone.update({
      where: { id },
      data,
    });
  }

  async deleteShippingZone(id: string) {
    return this.prisma.shippingZone.delete({
      where: { id }
    });
  }

  // --- Admin Users ---
  async getAdminUsers() {
    return this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      }
    });
  }

  async inviteAdminUser(data: { email: string, firstName: string, lastName: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: { role: Role.ADMIN }
      });
    }

    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('Admin@123!', 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.ADMIN,
        passwordHash: hash
      }
    });
  }

  async removeAdminAccess(userId: string) {
    // Reverts them to CUSTOMER
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.CUSTOMER }
    });
  }
}

