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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findAll(filters) {
        const { page = 1, limit = 12, category, collection, color, size, minPrice, maxPrice, search, sortBy, isFeatured, } = filters;
        const skip = (page - 1) * limit;
        const where = {
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
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
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
                            ...(color && { color: { equals: color, mode: 'insensitive' } }),
                            ...(size && { size }),
                            inventory: { gt: 0 },
                        },
                    },
                }
                : {}),
        };
        let orderBy = { createdAt: 'desc' };
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
    async findBySlug(slug) {
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
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } },
                variants: true,
                category: true,
                collection: true,
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, dto) {
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
    async updateVariant(id, dto) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id },
        });
        if (!variant) {
            throw new common_1.NotFoundException('Variant not found');
        }
        return this.prisma.productVariant.update({
            where: { id },
            data: { inventory: dto.inventory },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async getFeatured(limit = 8) {
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
    async getRelated(productId, limit = 4) {
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map