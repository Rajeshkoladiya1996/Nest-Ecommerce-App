import { IsNotEmpty, IsArray, IsNumber, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
