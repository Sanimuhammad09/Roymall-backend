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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_settings_service_1 = require("./store-settings.service");
const store_settings_dto_1 = require("./dto/store-settings.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let StoreSettingsController = class StoreSettingsController {
    storeSettingsService;
    constructor(storeSettingsService) {
        this.storeSettingsService = storeSettingsService;
    }
    async getSettings() {
        return this.storeSettingsService.getSettings();
    }
    async updateSettings(dto) {
        return this.storeSettingsService.updateSettings(dto);
    }
};
exports.StoreSettingsController = StoreSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get global store settings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoreSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update global store settings (admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_settings_dto_1.UpdateStoreSettingsDto]),
    __metadata("design:returntype", Promise)
], StoreSettingsController.prototype, "updateSettings", null);
exports.StoreSettingsController = StoreSettingsController = __decorate([
    (0, swagger_1.ApiTags)('store-settings'),
    (0, common_1.Controller)('store-settings'),
    __metadata("design:paramtypes", [store_settings_service_1.StoreSettingsService])
], StoreSettingsController);
//# sourceMappingURL=store-settings.controller.js.map