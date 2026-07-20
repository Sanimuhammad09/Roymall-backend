import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';

@Injectable()
export class StoreSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.storeSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await this.prisma.storeSettings.create({
        data: { id: 'global' },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateStoreSettingsDto) {
    return this.prisma.storeSettings.upsert({
      where: { id: 'global' },
      update: dto,
      create: {
        id: 'global',
        ...dto,
      },
    });
  }
}

