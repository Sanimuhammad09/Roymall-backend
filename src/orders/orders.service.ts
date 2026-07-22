import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(userId: string | undefined, dto: CreateOrderDto) {
    const orderNumber = `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          totalAmount: dto.total,
          subtotal: dto.subtotal,
          tax: dto.tax,
          shippingCost: dto.shippingCost,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.shippingAddress,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    const email = order.user?.email || (dto.shippingAddress as any)?.email;
    const firstName = order.user?.firstName || (dto.shippingAddress as any)?.firstName || 'Guest';

    if (email) {
      this.mailService.sendOrderConfirmationEmail(
        email,
        firstName,
        order.orderNumber,
        order.totalAmount,
      ).catch(err => console.error('Failed to send order confirmation email', err));
    }

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, images: { take: 1, orderBy: { order: 'asc' } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, images: { take: 1, orderBy: { order: 'asc' } } }
            }
          }
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAllAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
