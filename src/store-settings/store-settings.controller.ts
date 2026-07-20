import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoreSettingsService } from './store-settings.service';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('store-settings')
@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get global store settings' })
  async getSettings() {
    return this.storeSettingsService.getSettings();
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update global store settings (admin only)' })
  async updateSettings(@Body() dto: UpdateStoreSettingsDto) {
    return this.storeSettingsService.updateSettings(dto);
  }
}

