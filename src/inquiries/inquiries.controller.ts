import { Controller, Post, Body, Get, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, UpdateInquiryStatusDto } from './dto/inquiry.dto';
import { Public } from '../common/decorators/public.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a contact form message' })
  async create(@Body() dto: CreateInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries (admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inquiriesService.findAllAdmin({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Put('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status (admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryStatusDto,
  ) {
    return this.inquiriesService.updateStatus(id, dto.status);
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an inquiry (admin only)' })
  async remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}
