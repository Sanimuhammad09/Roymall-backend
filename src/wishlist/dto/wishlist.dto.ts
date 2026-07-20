import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantId: string;
}
