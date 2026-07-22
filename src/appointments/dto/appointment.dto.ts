import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Signature Scent Creation' })
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiPropertyOptional({ example: 'I prefer woody and spicy notes.' })
  @IsOptional()
  @IsString()
  olfactivePreferences?: string;

  @ApiPropertyOptional({ example: 'Please ensure wheelchair accessibility.' })
  @IsOptional()
  @IsString()
  specialNotes?: string;
}
