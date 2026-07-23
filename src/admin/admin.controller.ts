import { Controller, Get, Query, Put, Body, UseGuards, Post, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get dashboard overview metrics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.adminService.getOverviewMetrics(start, end);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get global store settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update global store settings' })
  async updateSettings(@Body() dto: UpdateStoreSettingsDto) {
    return this.adminService.updateSettings(dto);
  }

  // --- Shipping Zones ---
  @Get('shipping-zones')
  @ApiOperation({ summary: 'Get all shipping zones' })
  async getShippingZones() {
    return this.adminService.getShippingZones();
  }

  @Post('shipping-zones')
  @ApiOperation({ summary: 'Create a shipping zone' })
  async createShippingZone(@Body() data: any) {
    return this.adminService.createShippingZone(data);
  }

  @Put('shipping-zones/:id')
  @ApiOperation({ summary: 'Update a shipping zone' })
  async updateShippingZone(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateShippingZone(id, data);
  }

  @Delete('shipping-zones/:id')
  @ApiOperation({ summary: 'Delete a shipping zone' })
  async deleteShippingZone(@Param('id') id: string) {
    return this.adminService.deleteShippingZone(id);
  }

  // --- Admin Users ---
  @Get('users')
  @ApiOperation({ summary: 'Get all admin users' })
  async getAdminUsers() {
    return this.adminService.getAdminUsers();
  }

  @Post('users')
  @ApiOperation({ summary: 'Invite or elevate a user to admin' })
  async inviteAdminUser(@Body() data: { email: string, firstName: string, lastName: string }) {
    return this.adminService.inviteAdminUser(data);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Remove admin access from user' })
  async removeAdminAccess(@Param('id') id: string) {
    return this.adminService.removeAdminAccess(id);
  }
}

