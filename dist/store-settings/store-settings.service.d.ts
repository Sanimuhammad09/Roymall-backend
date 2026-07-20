import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';
export declare class StoreSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        currency: string;
        freeShippingThreshold: number;
        flatShippingRate: number;
        taxRate: number;
        contactEmail: string | null;
        contactPhone: string | null;
    }>;
    updateSettings(dto: UpdateStoreSettingsDto): Promise<{
        id: string;
        updatedAt: Date;
        currency: string;
        freeShippingThreshold: number;
        flatShippingRate: number;
        taxRate: number;
        contactEmail: string | null;
        contactPhone: string | null;
    }>;
}
