import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: any, dto: CreateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            isEmailVerified: boolean;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        items: ({
            variant: {
                product: {
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string;
                    slug: string;
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
            variantId: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    }>;
    findMine(user: any): Promise<({
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
            variantId: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    })[]>;
    findAllAdmin(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    })[]>;
    findOne(user: any, id: string): Promise<{
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
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
            variantId: string;
            quantity: number;
            unitPrice: number;
            hasEmbroidery: boolean;
            embroideryDesignId: string | null;
            orderId: string;
        })[];
        statusHistory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            note: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    }>;
    updateStatus(id: string, dto: import('./dto/order.dto').UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    }>;
}
