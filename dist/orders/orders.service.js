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
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async create(userId, dto) {
        const orderNumber = `ORD-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`;
        const order = await this.prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    status: client_1.OrderStatus.PENDING,
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
        const email = order.user?.email || dto.shippingAddress?.email;
        const firstName = order.user?.firstName || dto.shippingAddress?.firstName || 'Guest';
        if (email) {
            this.mailService.sendOrderConfirmationEmail(email, firstName, order.orderNumber, order.totalAmount).catch(err => console.error('Failed to send order confirmation email', err));
        }
        return order;
    }
    async findByUser(userId) {
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
    async findOne(id, userId) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findAllAdmin(params) {
        const { page, limit, status, search } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(status && { status }),
            ...(search && {
                OR: [
                    { orderNumber: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } },
                ],
            }),
        };
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    items: { include: { product: { select: { name: true, sku: true } } } },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneAdmin(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true } },
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, sku: true, price: true, images: { take: 1, orderBy: { order: 'asc' } } },
                        },
                    },
                },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map