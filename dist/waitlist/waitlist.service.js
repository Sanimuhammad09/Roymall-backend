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
exports.WaitlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WaitlistService = class WaitlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async join(dto) {
        const existing = await this.prisma.waitlist.findFirst({
            where: {
                productId: dto.productId,
                email: dto.email,
                isNotified: false,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You are already on the waitlist for this product');
        }
        return this.prisma.waitlist.create({
            data: {
                productId: dto.productId,
                email: dto.email,
                userId: dto.userId,
            },
        });
    }
    async notifyWaitlist(productId) {
        const waitlist = await this.prisma.waitlist.findMany({
            where: {
                productId,
                isNotified: false,
            },
            include: {
                product: true,
            },
        });
        for (const entry of waitlist) {
            console.log(`Sending back in stock email to ${entry.email} for product ${entry.product.name}`);
            await this.prisma.waitlist.update({
                where: { id: entry.id },
                data: { isNotified: true },
            });
        }
        return { notifiedCount: waitlist.length };
    }
};
exports.WaitlistService = WaitlistService;
exports.WaitlistService = WaitlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WaitlistService);
//# sourceMappingURL=waitlist.service.js.map