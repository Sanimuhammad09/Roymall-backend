import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsService {
    private readonly prisma;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
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
    uploadImages(productId: string, files: Express.Multer.File[], isPrimary: boolean): Promise<{
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
    deleteImage(productId: string, imageId: string): Promise<{
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
