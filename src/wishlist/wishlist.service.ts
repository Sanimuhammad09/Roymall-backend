import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { take: 1, orderBy: { order: 'asc' } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: { items: { include: { variant: { include: { product: { include: { images: true } } } } } } }
      });
    }

    return wishlist;
  }

  async addItem(userId: string, dto: AddToWishlistDto) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
      });
    }

    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        variantId: dto.variantId,
      },
    });

    if (existingItem) {
      return this.getWishlist(userId); // Already in wishlist
    }

    await this.prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        variantId: dto.variantId,
      },
    });

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, variantId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) throw new NotFoundException('Wishlist not found');

    await this.prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        variantId,
      },
    });

    return this.getWishlist(userId);
  }
}
