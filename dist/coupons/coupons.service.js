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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CouponsService = class CouponsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code.toUpperCase() } });
        if (existing) {
            throw new common_1.BadRequestException('Coupon code already exists');
        }
        return this.prisma.coupon.create({
            data: {
                ...dto,
                code: dto.code.toUpperCase(),
            },
        });
    }
    async findAll() {
        return this.prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async validate(dto) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: dto.code.toUpperCase() },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Invalid coupon code');
        }
        if (!coupon.isActive) {
            throw new common_1.BadRequestException('This coupon is no longer active');
        }
        const now = new Date();
        if (coupon.startDate && new Date(coupon.startDate) > now) {
            throw new common_1.BadRequestException('This coupon is not active yet');
        }
        if (coupon.endDate && new Date(coupon.endDate) < now) {
            throw new common_1.BadRequestException('This coupon has expired');
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('This coupon has reached its usage limit');
        }
        if (coupon.minOrderValue && dto.orderValue < coupon.minOrderValue) {
            throw new common_1.BadRequestException(`Order value must be at least $${coupon.minOrderValue}`);
        }
        let discountAmount = 0;
        if (coupon.type === 'percentage') {
            discountAmount = dto.orderValue * (coupon.value / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        }
        else if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
        }
        else if (coupon.type === 'free_shipping') {
            discountAmount = 0;
        }
        discountAmount = Math.min(discountAmount, dto.orderValue);
        return {
            valid: true,
            coupon,
            discountAmount,
        };
    }
    async updateUsage(id) {
        return this.prisma.coupon.update({
            where: { id },
            data: { usageCount: { increment: 1 } },
        });
    }
    async remove(id) {
        return this.prisma.coupon.delete({ where: { id } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map