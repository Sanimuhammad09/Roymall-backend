import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WaitlistService } from './waitlist.service';
import { JoinWaitlistDto } from './dto/waitlist.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Public()
  @Post('join')
  @ApiOperation({ summary: 'Join product waitlist' })
  async join(@Body() dto: JoinWaitlistDto) {
    return this.waitlistService.join(dto);
  }
}
