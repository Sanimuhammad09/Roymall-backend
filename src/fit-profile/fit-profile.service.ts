import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveFitProfileDto } from './dto/fit-profile.dto';

@Injectable()
export class FitProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async saveProfile(userId: string, dto: SaveFitProfileDto) {
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

  async getProfile(userId: string) {
    return this.prisma.fitProfile.findUnique({
      where: { userId },
    });
  }

  async getRecommendations(userId: string) {
    const profile = await this.getProfile(userId);
    if (!profile) return { recommendedSize: null };

    // Extremely simple mock recommendation algorithm
    // In a real app, this would use a complex logic matrix or machine learning model
    let recommendedSize = 'M';
    
    if (profile.heightCm > 185 && profile.weightKg > 90) {
      recommendedSize = 'XL';
    } else if (profile.heightCm > 175 && profile.weightKg > 80) {
      recommendedSize = 'L';
    } else if (profile.heightCm < 165 && profile.weightKg < 60) {
      recommendedSize = 'XS';
    } else if (profile.heightCm < 170 && profile.weightKg < 70) {
      recommendedSize = 'S';
    }

    // Adjust for fit preference
    if (profile.preferredFit === 'relaxed') {
      // Shift up a size if possible
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const idx = sizes.indexOf(recommendedSize);
      if (idx !== -1 && idx < sizes.length - 1) {
        recommendedSize = sizes[idx + 1];
      }
    } else if (profile.preferredFit === 'slim') {
       // Shift down a size if possible
       const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
       const idx = sizes.indexOf(recommendedSize);
       if (idx > 0) {
         recommendedSize = sizes[idx - 1];
       }
    }

    return {
      profile,
      recommendedSize,
      confidence: 85, // Mock confidence score
    };
  }
}
