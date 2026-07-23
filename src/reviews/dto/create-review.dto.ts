import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Optional text comment', example: 'Amazing scent!' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'ID of the product being reviewed' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
