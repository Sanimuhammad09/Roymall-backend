import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user?.id;
    return this.ordersService.create(userId, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  async findMyOrders(@Req() req: any) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific order' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  async findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
  ) {
    return this.ordersService.findAllAdmin({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      status,
      search,
    });
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific order (admin only)' })
  async findOneAdmin(@Param('id') id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  @Put('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
