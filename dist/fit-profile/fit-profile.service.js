"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FitProfileService = class FitProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveProfile(userId, dto) {
        const existing = await this.prisma.fitProfile.findUnique({
            where: { userId },
        });
        if (existing) {
            return this.prisma.fitProfile.update({
                where: { userId },
                data: dto,
            });
        }
        return this.prisma.fitProfile.create({
            data: {
                userId,
                ...dto,
            },
        });
    }
    async getProfile(userId) {
        return this.prisma.fitProfile.findUnique({
            where: { userId },
        });
    }
    async getRecommendations(userId) {
        const profile = await this.getProfile(userId);
        if (!profile)
            return { recommendedSize: null };
        let recommendedSize = 'M';
        if (profile.heightCm > 185 && profile.weightKg > 90) {
            recommendedSize = 'XL';
        }
        else if (profile.heightCm > 175 && profile.weightKg > 80) {
            recommendedSize = 'L';
        }
        else if (profile.heightCm < 165 && profile.weightKg < 60) {
            recommendedSize = 'XS';
        }
        else if (profile.heightCm < 170 && profile.weightKg < 70) {
            recommendedSize = 'S';
        }
        if (profile.preferredFit === 'relaxed') {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            const idx = sizes.indexOf(recommendedSize);
            if (idx !== -1 && idx < sizes.length - 1) {
                recommendedSize = sizes[idx + 1];
            }
        }
        else if (profile.preferredFit === 'slim') {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            const idx = sizes.indexOf(recommendedSize);
            if (idx > 0) {
                recommendedSize = sizes[idx - 1];
            }
        }
        return {
            profile,
            recommendedSize,
            confidence: 85,
        };
    }
};
exports.FitProfileService = FitProfileService;
exports.FitProfileService = FitProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FitProfileService);
//# sourceMappingURL=fit-profile.service.js.map