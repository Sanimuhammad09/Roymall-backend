declare class VariantDto {
    sku: string;
    barcode?: string;
    color: string;
    colorHex?: string;
    size: string;
    priceOffset?: number;
    inventory: number;
}
declare class ProductImageDto {
    url: string;
    alt?: string;
    order?: number;
    isMain?: boolean;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    fabricDetails?: string;
    careInstructions?: string;
    basePrice: number;
    isFeatured?: boolean;
    categoryId: string;
    collectionId?: string;
    variants?: VariantDto[];
    images?: ProductImageDto[];
}
export declare class UpdateProductDto {
    name?: string;
    slug?: string;
    description?: string;
    fabricDetails?: string;
    careInstructions?: string;
    basePrice?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    categoryId?: string;
    collectionId?: string;
}
export declare class ProductFilterDto {
    category?: string;
    collection?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
}
export {};
