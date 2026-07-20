"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
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
    async addItem(userId, dto) {
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
            return this.getWishlist(userId);
        }
        await this.prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                variantId: dto.variantId,
            },
        });
        return this.getWishlist(userId);
    }
    async removeItem(userId, variantId) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist)
            throw new common_1.NotFoundException('Wishlist not found');
        await this.prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
                variantId,
            },
        });
        return this.getWishlist(userId);
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map