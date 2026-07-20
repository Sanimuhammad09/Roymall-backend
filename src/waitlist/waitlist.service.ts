import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JoinWaitlistDto } from './dto/waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async join(dto: JoinWaitlistDto) {
    const existing = await this.prisma.waitlist.findFirst({
      where: {
        productId: dto.productId,
        email: dto.email,
        isNotified: false,
      },
    });

    if (existing) {
      throw new BadRequestException('You are already on the waitlist for this product');
    }

    return this.prisma.waitlist.create({
      data: {
        productId: dto.productId,
        email: dto.email,
        userId: dto.userId,
      },
    });
  }

  // Called via chron job or admin action when stock is updated
  async notifyWaitlist(productId: string) {
    const waitlist = await this.prisma.waitlist.findMany({
      where: {
        productId,
        isNotified: false,
      },
      include: {
        product: true,
      },
    });

    // Mock sending email
    for (const entry of waitlist) {
      console.log(`Sending back in stock email to ${entry.email} for product ${entry.product.name}`);
      await this.prisma.waitlist.update({
        where: { id: entry.id },
        data: { isNotified: true },
      });
    }

    return { notifiedCount: waitlist.length };
  }
}
