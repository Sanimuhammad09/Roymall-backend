import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                tagline: string | null;
                price: number;
                sku: string;
                stockQuantity: number;
                size: string | null;
                olfactoryFamily: string | null;
                isBestSeller: boolean;
                isNewArrival: boolean;
                topNotes: string[];
                heartNotes: string[];
                baseNotes: string[];
                categoryId: string;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtPurchase: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findMyOrders(req: any): Promise<({
        items: ({
            product: {
                name: string;
                sku: string;
                images: {
                    order: number;
                    id: string;
                    url: string;
                    isPrimary: boolean;
                    productId: string;
                    publicId: string | null;
                }[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtPurchase: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string, req: any): Promise<{
        items: ({
            product: {
                name: string;
                sku: string;
                images: {
                    order: number;
                    id: string;
                    url: string;
                    isPrimary: boolean;
                    productId: string;
                    publicId: string | null;
                }[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtPurchase: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAllAdmin(page?: string, limit?: string, status?: OrderStatus, search?: string): Promise<{
        data: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            } | null;
            items: ({
                product: {
                    name: string;
                    sku: string;
                };
            } & {
                id: string;
                productId: string;
                quantity: number;
                priceAtPurchase: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            orderNumber: string;
            totalAmount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            shippingAddressId: string | null;
            billingAddressId: string | null;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
            billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneAdmin(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
        } | null;
        items: ({
            product: {
                name: string;
                id: string;
                price: number;
                sku: string;
                images: {
                    order: number;
                    id: string;
                    url: string;
                    isPrimary: boolean;
                    productId: string;
                    publicId: string | null;
                }[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtPurchase: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
