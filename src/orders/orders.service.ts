import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { InvoiceService } from './invoice.service';
import { randomBytes } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Generate a unique order number (e.g., ORD-ABC1234)
    const orderNumber = `ORD-${randomBytes(4).toString('hex').toUpperCase()}`;

    // Calculate total discount (mock logic for now, this would check the coupon validity)
    const discountAmount = 0; 

    // Create the order in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // 1. Create the Order record
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          totalAmount: dto.total,
          subtotal: dto.subtotal,
          taxAmount: dto.tax,
          shippingCost: dto.shippingCost,
          discountAmount,
          couponCode: dto.couponCode,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.shippingAddress, // Using shipping as billing for simplicity
          items: {
            create: dto.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          user: true,
        },
      });

      // 2. Decrement inventory for each variant
      for (const item of dto.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
        
        // Record stock history
        await tx.stockHistory.create({
          data: {
            variantId: item.variantId,
            quantity: -item.quantity,
            reason: 'purchase',
            referenceId: createdOrder.id,
          }
        });
      }

      // 3. Create initial status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,
          status: 'PENDING',
          note: 'Order created',
        },
      });

      // 4. Generate Invoice
      const pdfUrl = await this.invoiceService.generateInvoice(createdOrder);
      await tx.invoice.create({
        data: {
          orderId: createdOrder.id,
          pdfUrl,
        }
      });

      return createdOrder;
    });

    // Send confirmation email asynchronously (don't block the response)
    this.mailService.sendOrderConfirmationEmail(
      order.user.email,
      order.user.firstName,
      order.orderNumber,
      order.totalAmount,
    ).catch(err => console.error('Failed to send order confirmation email', err));

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { name: true, slug: true, images: { take: 1, orderBy: { order: 'asc' } } }
                }
              }
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
            variant: {
              include: {
                product: {
                  select: { name: true, slug: true, images: { take: 1, orderBy: { order: 'asc' } } }
                }
              }
            }
          }
        },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Admin methods
  async findAllAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async updateStatus(id: string, status: any, note?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          note,
        },
      });

      return updatedOrder;
    });
  }
}
