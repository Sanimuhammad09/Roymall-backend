import { StoreSettingsService } from './store-settings.service';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';
export declare class StoreSettingsController {
    private readonly storeSettingsService;
    constructor(storeSettingsService: StoreSettingsService);
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
