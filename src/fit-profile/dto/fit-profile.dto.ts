import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveFitProfileDto {
  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNumber()
  heightCm: number;

  @ApiProperty()
  @IsNumber()
  weightKg: number;

  @ApiProperty()
  @IsString()
  bodyShape: string;

  @ApiProperty()
  @IsString()
  preferredFit: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandSizeRef?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ageRange?: string;
}
