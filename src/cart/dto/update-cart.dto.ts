import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsUUID()
  readonly userId?: string;

  @IsOptional()
  @IsUUID()
  readonly productId?: string;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;
}
