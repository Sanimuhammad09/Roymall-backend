import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code.toUpperCase() } });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
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

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('This coupon is no longer active');
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      throw new BadRequestException('This coupon is not active yet');
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      throw new BadRequestException('This coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }

    if (coupon.minOrderValue && dto.orderValue < coupon.minOrderValue) {
      throw new BadRequestException(`Order value must be at least $${coupon.minOrderValue}`);
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = dto.orderValue * (coupon.value / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    } else if (coupon.type === 'free_shipping') {
      discountAmount = 0; // handled during shipping calculation
    }

    // Don't allow discount to exceed order value
    discountAmount = Math.min(discountAmount, dto.orderValue);

    return {
      valid: true,
      coupon,
      discountAmount,
    };
  }

  async updateUsage(id: string) {
    return this.prisma.coupon.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }

  async remove(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
