import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId must be provided');
    }

    let cart = await this.prisma.cart.findFirst({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          sessionId,
        },
      });
    }

    // If they were previously using sessionId and now logged in, we could merge carts, 
    // but for simplicity we'll just return the cart found.
    return cart;
  }

  async getCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) return null;

    return this.prisma.cart.findFirst({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, price: true, images: { take: 1, orderBy: { order: 'asc' } } }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
      },
    });
  }

  async addToCart(userId: string | undefined, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId, dto.sessionId);
    
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (dto.quantity || 1),
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity || 1,
        price: product.price, // capture price at time of add
      },
    });
  }

  async updateItem(itemId: string, dto: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}
