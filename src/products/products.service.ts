import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { images, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? { createMany: { data: images } }
          : undefined,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
    });
  }

  async findAll(filters: ProductFilterDto) {
    const {
      page = 1,
      limit = 12,
      category,
      isNewArrival,
      isBestSeller,
      olfactoryFamily,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(category && {
        category: { slug: category },
      }),
      ...(isNewArrival !== undefined && { isNewArrival }),
      ...(isBestSeller !== undefined && { isBestSeller }),
      ...(olfactoryFamily && { olfactoryFamily: { equals: olfactoryFamily, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id); // ensure it exists
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
