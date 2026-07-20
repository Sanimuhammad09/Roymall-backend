import { OrderStatus } from '@prisma/client';
declare class OrderItemDto {
    variantId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: any;
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    couponCode?: string;
    discountAmount?: number;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    note?: string;
}
export {};
