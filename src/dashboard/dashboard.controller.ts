import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue data over time' })
  async getRevenueData() {
    return this.dashboardService.getRevenueData();
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders' })
  async getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get comprehensive analytics data' })
  async getAnalytics() {
    return this.dashboardService.getAnalytics();
  }
}
