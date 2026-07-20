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
exports.StoreSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StoreSettingsService = class StoreSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        let settings = await this.prisma.storeSettings.findUnique({
            where: { id: 'global' },
        });
        if (!settings) {
            settings = await this.prisma.storeSettings.create({
                data: { id: 'global' },
            });
        }
        return settings;
    }
    async updateSettings(dto) {
        return this.prisma.storeSettings.upsert({
            where: { id: 'global' },
            update: dto,
            create: {
                id: 'global',
                ...dto,
            },
        });
    }
};
exports.StoreSettingsService = StoreSettingsService;
exports.StoreSettingsService = StoreSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoreSettingsService);
//# sourceMappingURL=store-settings.service.js.map