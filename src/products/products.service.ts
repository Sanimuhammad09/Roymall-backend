import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { variants, images, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        variants: variants
          ? { createMany: { data: variants } }
          : undefined,
        images: images
          ? { createMany: { data: images } }
          : undefined,
      },
      include: {
        variants: true,
        images: { orderBy: { order: 'asc' } },
        category: true,
        collection: true,
      },
    });
  }

  async findAll(filters: ProductFilterDto) {
    const {
      page = 1,
      limit = 12,
      category,
      collection,
      color,
      size,
      minPrice,
      maxPrice,
      search,
      sortBy,
      isFeatured,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && {
        category: { slug: category },
      }),
      ...(collection && {
        collection: { slug: collection },
      }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(minPrice || maxPrice
        ? {
            basePrice: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
      ...(color || size
        ? {
            variants: {
              some: {
                ...(color && { color: { equals: color, mode: 'insensitive' as const } }),
                ...(size && { size }),
                inventory: { gt: 0 },
              },
            },
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price_asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { order: 'asc' }, take: 2 },
          variants: {
            select: {
              id: true,
              color: true,
              colorHex: true,
              size: true,
              priceOffset: true,
              inventory: true,
            },
          },
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
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

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
        collection: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
        collection: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
        collection: true,
      },
    });
  }

  async updateVariant(id: string, dto: { inventory: number }) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.prisma.productVariant.update({
      where: { id },
      data: { inventory: dto.inventory },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async getFeatured(limit: number = 8) {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 2 },
        variants: {
          select: { color: true, colorHex: true },
          distinct: ['color'],
        },
      },
    });
  }

  async getRelated(productId: string, limit: number = 4) {
    const product = await this.findById(productId);

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        categoryId: product.categoryId,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 2 },
        variants: {
          select: { color: true, colorHex: true },
          distinct: ['color'],
        },
      },
    });
  }
}
