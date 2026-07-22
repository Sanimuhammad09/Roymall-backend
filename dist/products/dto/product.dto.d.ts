declare class ProductImageDto {
    url: string;
    order?: number;
    isPrimary?: boolean;
}
export declare class CreateProductDto {
    name: string;
    tagline?: string;
    description: string;
    price: number;
    sku: string;
    stockQuantity?: number;
    size?: string;
    olfactoryFamily?: string;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    topNotes?: string[];
    heartNotes?: string[];
    baseNotes?: string[];
    categoryId: string;
    images?: ProductImageDto[];
}
export declare class UpdateProductDto {
    name?: string;
    tagline?: string;
    description?: string;
    price?: number;
    sku?: string;
    stockQuantity?: number;
    size?: string;
    olfactoryFamily?: string;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    topNotes?: string[];
    heartNotes?: string[];
    baseNotes?: string[];
    categoryId?: string;
}
export declare class ProductFilterDto {
    category?: string;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    olfactoryFamily?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
