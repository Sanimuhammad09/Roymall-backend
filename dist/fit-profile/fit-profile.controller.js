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
exports.FitProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fit_profile_service_1 = require("./fit-profile.service");
const fit_profile_dto_1 = require("./dto/fit-profile.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FitProfileController = class FitProfileController {
    fitProfileService;
    constructor(fitProfileService) {
        this.fitProfileService = fitProfileService;
    }
    async getProfile(user) {
        return this.fitProfileService.getRecommendations(user.id);
    }
    async saveProfile(user, dto) {
        return this.fitProfileService.saveProfile(user.id, dto);
    }
};
exports.FitProfileController = FitProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user fit profile and recommendations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FitProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Save or update user fit profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fit_profile_dto_1.SaveFitProfileDto]),
    __metadata("design:returntype", Promise)
], FitProfileController.prototype, "saveProfile", null);
exports.FitProfileController = FitProfileController = __decorate([
    (0, swagger_1.ApiTags)('fit-profile'),
    (0, common_1.Controller)('fit-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [fit_profile_service_1.FitProfileService])
], FitProfileController);
//# sourceMappingURL=fit-profile.controller.js.map