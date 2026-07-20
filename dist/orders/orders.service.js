"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const invoice_service_1 = require("./invoice.service");
const crypto_1 = require("crypto");
let OrdersService = class OrdersService {
    prisma;
    mailService;
    invoiceService;
    constructor(prisma, mailService, invoiceService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.invoiceService = invoiceService;
    }
    async create(userId, dto) {
        const orderNumber = `ORD-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`;
        const discountAmount = 0;
        const order = await this.prisma.$transaction(async (tx) => {
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
                    billingAddress: dto.shippingAddress,
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
            for (const item of dto.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        inventory: {
                            decrement: item.quantity,
                        },
                    },
                });
                await tx.stockHistory.create({
                    data: {
                        variantId: item.variantId,
                        quantity: -item.quantity,
                        reason: 'purchase',
                        referenceId: createdOrder.id,
                    }
                });
            }
            await tx.orderStatusHistory.create({
                data: {
                    orderId: createdOrder.id,
                    status: 'PENDING',
                    note: 'Order created',
                },
            });
            const pdfUrl = await this.invoiceService.generateInvoice(createdOrder);
            await tx.invoice.create({
                data: {
                    orderId: createdOrder.id,
                    pdfUrl,
                }
            });
            return createdOrder;
        });
        this.mailService.sendOrderConfirmationEmail(order.user.email, order.user.firstName, order.orderNumber, order.totalAmount).catch(err => console.error('Failed to send order confirmation email', err));
        return order;
    }
    async findByUser(userId) {
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
    async findOne(id, userId) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findAllAdmin() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
    }
    async updateStatus(id, status, note) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        invoice_service_1.InvoiceService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map