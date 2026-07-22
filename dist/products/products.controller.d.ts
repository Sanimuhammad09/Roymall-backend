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
            images: {
                order: number;
                id: string;
                url: string;
                isPrimary: boolean;
                productId: string;
                publicId: string | null;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            tagline: string | null;
            price: number;
            sku: string;
            stockQuantity: number;
            size: string | null;
            olfactoryFamily: string | null;
            isBestSeller: boolean;
            isNewArrival: boolean;
            topNotes: string[];
            heartNotes: string[];
            baseNotes: string[];
            categoryId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        };
        images: {
            order: number;
            id: string;
            url: string;
            isPrimary: boolean;
            productId: string;
            publicId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
    create(dto: CreateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        };
        images: {
            order: number;
            id: string;
            url: string;
            isPrimary: boolean;
            productId: string;
            publicId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        };
        images: {
            order: number;
            id: string;
            url: string;
            isPrimary: boolean;
            productId: string;
            publicId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
    uploadImages(id: string, files: Express.Multer.File[], isPrimary?: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        };
        images: {
            order: number;
            id: string;
            url: string;
            isPrimary: boolean;
            productId: string;
            publicId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
    deleteImage(id: string, imageId: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        };
        images: {
            order: number;
            id: string;
            url: string;
            isPrimary: boolean;
            productId: string;
            publicId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        tagline: string | null;
        price: number;
        sku: string;
        stockQuantity: number;
        size: string | null;
        olfactoryFamily: string | null;
        isBestSeller: boolean;
        isNewArrival: boolean;
        topNotes: string[];
        heartNotes: string[];
        baseNotes: string[];
        categoryId: string;
    }>;
}
