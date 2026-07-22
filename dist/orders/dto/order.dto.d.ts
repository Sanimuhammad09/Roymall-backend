import { OrderStatus } from '@prisma/client';
declare class OrderItemDto {
    productId: string;
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
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
export {};
