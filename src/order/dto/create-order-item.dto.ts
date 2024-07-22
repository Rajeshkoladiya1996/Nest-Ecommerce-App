import { IsInt, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
