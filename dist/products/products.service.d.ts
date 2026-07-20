import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
        } | null;
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    findAll(filters: ProductFilterDto): Promise<{
        data: ({
            category: {
                name: string;
                slug: string;
            };
            _count: {
                reviews: number;
            };
            variants: {
                id: string;
                color: string;
                colorHex: string | null;
                size: string;
                priceOffset: number;
                inventory: number;
            }[];
            images: {
                order: number;
                id: string;
                productId: string;
                url: string;
                alt: string | null;
                isMain: boolean;
            }[];
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            slug: string;
            fabricDetails: string | null;
            careInstructions: string | null;
            basePrice: number;
            isFeatured: boolean;
            categoryId: string;
            collectionId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
        } | null;
        reviews: ({
            user: {
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            rating: number;
            title: string | null;
            content: string;
            isApproved: boolean;
            productId: string;
        })[];
        _count: {
            reviews: number;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
        videos: {
            order: number;
            id: string;
            productId: string;
            url: string;
            thumbnail: string | null;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    findById(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
        } | null;
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            image: string | null;
        } | null;
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    updateVariant(id: string, dto: {
        inventory: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string;
        barcode: string | null;
        color: string;
        colorHex: string | null;
        size: string;
        priceOffset: number;
        inventory: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    getFeatured(limit?: number): Promise<({
        variants: {
            color: string;
            colorHex: string | null;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    })[]>;
    getRelated(productId: string, limit?: number): Promise<({
        variants: {
            color: string;
            colorHex: string | null;
        }[];
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            alt: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    })[]>;
}
