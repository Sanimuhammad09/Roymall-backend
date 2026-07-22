import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get current cart state' })
  @ApiQuery({ name: 'sessionId', required: false, type: String })
  async getCart(@Req() req: any, @Query('sessionId') sessionId?: string) {
    const userId = req.user?.id;
    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Public()
  @Put(':itemId')
  @ApiOperation({ summary: 'Update item quantity' })
  async updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(itemId, dto);
  }

  @Public()
  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  @Public()
  @Delete('clear/all')
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiQuery({ name: 'sessionId', required: false, type: String })
  async clearCart(@Req() req: any, @Query('sessionId') sessionId?: string) {
    const userId = req.user?.id;
    return this.cartService.clearCart(userId, sessionId);
  }
}
