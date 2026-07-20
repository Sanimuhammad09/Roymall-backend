import { Module } from '@nestjs/common';
import { FitProfileService } from './fit-profile.service';
import { FitProfileController } from './fit-profile.controller';

@Module({
  providers: [FitProfileService],
  controllers: [FitProfileController],
  exports: [FitProfileService],
})
export class FitProfileModule {}
