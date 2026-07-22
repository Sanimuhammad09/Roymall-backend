import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(userId: string | undefined, dto: CreateOrderDto): Promise<{
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
    findByUser(userId: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    findAllAdmin(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        } | null;
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
    updateStatus(id: string, status: OrderStatus): Promise<{
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
