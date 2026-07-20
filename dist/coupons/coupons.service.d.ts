import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    updateUsage(id: string): Promise<{
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
