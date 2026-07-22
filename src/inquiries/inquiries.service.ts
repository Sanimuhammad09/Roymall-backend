import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/inquiry.dto';
import { InquiryStatus } from '@prisma/client';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: {
        ...dto,
        status: InquiryStatus.UNREAD,
      },
    });
  }

  async findAllAdmin(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        skip,
        take: limit,
        orderBy: [
          { status: 'asc' }, // UNREAD comes first alphabetically before RESPONDED
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.inquiry.count(),
    ]);

    return {
      data: inquiries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: InquiryStatus) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');

    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');

    return this.prisma.inquiry.delete({ where: { id } });
  }
}
