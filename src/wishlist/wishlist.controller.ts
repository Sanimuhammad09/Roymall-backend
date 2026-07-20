import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  async getWishlist(@CurrentUser() user: any) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to wishlist' })
  async addItem(@CurrentUser() user: any, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.addItem(user.id, dto);
  }

  @Delete(':variantId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  async removeItem(@CurrentUser() user: any, @Param('variantId') variantId: string) {
    return this.wishlistService.removeItem(user.id, variantId);
  }
}
