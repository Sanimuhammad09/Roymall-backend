import { CouponsService } from './coupons.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    validate(dto: ValidateCouponDto): Promise<{
        valid: boolean;
        coupon: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            code: string;
            value: number;
            minOrderValue: number | null;
            maxDiscount: number | null;
            startDate: Date | null;
            endDate: Date | null;
            usageLimit: number | null;
            usageCount: number;
        };
        discountAmount: number;
    }>;
    create(dto: CreateCouponDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        value: number;
        minOrderValue: number | null;
        maxDiscount: number | null;
        startDate: Date | null;
        endDate: Date | null;
        usageLimit: number | null;
        usageCount: number;
    }>;
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        value: number;
        minOrderValue: number | null;
        maxDiscount: number | null;
        startDate: Date | null;
        endDate: Date | null;
        usageLimit: number | null;
        usageCount: number;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        value: number;
        minOrderValue: number | null;
        maxDiscount: number | null;
        startDate: Date | null;
        endDate: Date | null;
        usageLimit: number | null;
        usageCount: number;
    }>;
}
