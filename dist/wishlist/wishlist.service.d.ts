import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/wishlist.dto';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            variant: {
                product: {
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
                };
            } & {
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
            };
        } & {
            id: string;
            createdAt: Date;
            variantId: string;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, dto: AddToWishlistDto): Promise<{
        items: ({
            variant: {
                product: {
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
                };
            } & {
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
            };
        } & {
            id: string;
            createdAt: Date;
            variantId: string;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(userId: string, variantId: string): Promise<{
        items: ({
            variant: {
                product: {
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
                };
            } & {
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
            };
        } & {
            id: string;
            createdAt: Date;
            variantId: string;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
