import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filters: ProductFilterDto): Promise<{
        data: ({
            category: {
                name: string;
                slug: string;
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
                url: string;
                alt: string | null;
                isMain: boolean;
                productId: string;
            }[];
            _count: {
                reviews: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string;
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
    getFeatured(limit?: number): Promise<({
        variants: {
            color: string;
            colorHex: string | null;
        }[];
        images: {
            order: number;
            id: string;
            url: string;
            alt: string | null;
            isMain: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
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
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
            productId: string;
        }[];
        images: {
            order: number;
            id: string;
            url: string;
            alt: string | null;
            isMain: boolean;
            productId: string;
        }[];
        videos: {
            order: number;
            id: string;
            url: string;
            productId: string;
            thumbnail: string | null;
        }[];
        _count: {
            reviews: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    getRelated(id: string, limit?: number): Promise<({
        variants: {
            color: string;
            colorHex: string | null;
        }[];
        images: {
            order: number;
            id: string;
            url: string;
            alt: string | null;
            isMain: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    })[]>;
    create(dto: CreateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
        } | null;
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
            productId: string;
        }[];
        images: {
            order: number;
            id: string;
            url: string;
            alt: string | null;
            isMain: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            parentId: string | null;
        };
        collection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
        } | null;
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            color: string;
            colorHex: string | null;
            size: string;
            priceOffset: number;
            inventory: number;
            productId: string;
        }[];
        images: {
            order: number;
            id: string;
            url: string;
            alt: string | null;
            isMain: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
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
        sku: string;
        barcode: string | null;
        color: string;
        colorHex: string | null;
        size: string;
        priceOffset: number;
        inventory: number;
        productId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        fabricDetails: string | null;
        careInstructions: string | null;
        basePrice: number;
        isFeatured: boolean;
        categoryId: string;
        collectionId: string | null;
    }>;
}
