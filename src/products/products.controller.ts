import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with filters and pagination' })
  async findAll(@Query() filters: ProductFilterDto) {
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single product by ID' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin only)' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/images')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Upload images for a product (admin only)' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('isPrimary') isPrimary?: string,
  ) {
    return this.productsService.uploadImages(id, files, isPrimary === 'true');
  }

  @Delete(':id/images/:imageId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image from a product (admin only)' })
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteImage(id, imageId);
  }
}
