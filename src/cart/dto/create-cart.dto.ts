import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCartDto {

  @IsNotEmpty()
  readonly productId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}
