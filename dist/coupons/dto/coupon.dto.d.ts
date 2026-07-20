export declare class CreateCouponDto {
    code: string;
    type: string;
    value: number;
    minOrderValue?: number;
    maxDiscount?: number;
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    isActive?: boolean;
}
export declare class ValidateCouponDto {
    code: string;
    orderValue: number;
}
