import { PrismaService } from '../prisma/prisma.service';
import { SaveFitProfileDto } from './dto/fit-profile.dto';
export declare class FitProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveProfile(userId: string, dto: SaveFitProfileDto): Promise<{
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
    getProfile(userId: string): Promise<{
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
    } | null>;
    getRecommendations(userId: string): Promise<{
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
}
