import { FitProfileService } from './fit-profile.service';
import { SaveFitProfileDto } from './dto/fit-profile.dto';
export declare class FitProfileController {
    private readonly fitProfileService;
    constructor(fitProfileService: FitProfileService);
    getProfile(user: any): Promise<{
        recommendedSize: null;
        profile?: undefined;
        confidence?: undefined;
    } | {
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            gender: string;
            heightCm: number;
            weightKg: number;
            bodyShape: string;
            preferredFit: string;
            brandSizeRef: string | null;
            ageRange: string | null;
        };
        recommendedSize: string;
        confidence: number;
    }>;
    saveProfile(user: any, dto: SaveFitProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        gender: string;
        heightCm: number;
        weightKg: number;
        bodyShape: string;
        preferredFit: string;
        brandSizeRef: string | null;
        ageRange: string | null;
    }>;
}
