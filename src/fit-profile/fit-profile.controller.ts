import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FitProfileService } from './fit-profile.service';
import { SaveFitProfileDto } from './dto/fit-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('fit-profile')
@Controller('fit-profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FitProfileController {
  constructor(private readonly fitProfileService: FitProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user fit profile and recommendations' })
  async getProfile(@CurrentUser() user: any) {
    return this.fitProfileService.getRecommendations(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Save or update user fit profile' })
  async saveProfile(@CurrentUser() user: any, @Body() dto: SaveFitProfileDto) {
    return this.fitProfileService.saveProfile(user.id, dto);
  }
}
