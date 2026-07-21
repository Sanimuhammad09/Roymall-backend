import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { InvoiceService } from './invoice.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly mailService;
    private readonly invoiceService;
    constructor(prisma: PrismaService, mailService: MailService, invoiceService: InvoiceService);
    create(userId: string | undefined, dto: CreateOrderDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            isEmailVerified: boolean;
            avatar: string | null;
        } | null;
        items: ({
            variant: {
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    slug: string;
                    description: string;
                    fabricDetails: string | null;
                    careInstructions: string | null;
                    basePrice: number;
                    isFeatured: boolean;
                    categoryId: string;
                    collectionId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                barcode: string | null;
                color: string;
                colorHex: string | null;
                size: string;
                priceOffset: number;
                inventory: number;
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            variantId: string;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    findByUser(userId: string): Promise<({
        items: ({
            variant: {
                product: {
                    name: string;
                    slug: string;
                    images: {
                        order: number;
                        id: string;
                        productId: string;
                        url: string;
                        alt: string | null;
                        isMain: boolean;
                    }[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                barcode: string | null;
                color: string;
                colorHex: string | null;
                size: string;
                priceOffset: number;
                inventory: number;
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            variantId: string;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        payment: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            provider: string;
            transactionId: string;
            amount: number;
            currency: string;
        } | null;
        items: ({
            variant: {
                product: {
                    name: string;
                    slug: string;
                    images: {
                        order: number;
                        id: string;
                        productId: string;
                        url: string;
                        alt: string | null;
                        isMain: boolean;
                    }[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                barcode: string | null;
                color: string;
                colorHex: string | null;
                size: string;
                priceOffset: number;
                inventory: number;
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            variantId: string;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            note: string | null;
        }[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    findAllAdmin(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    })[]>;
    updateStatus(id: string, status: any, note?: string): Promise<{
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
}
