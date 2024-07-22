import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'inactive'])
  @IsNotEmpty()
  status: 'active' | 'inactive';

  @IsString()
  @IsNotEmpty()
  userId: string;  // The user who created this product
}
