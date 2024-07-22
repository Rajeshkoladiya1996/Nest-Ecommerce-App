import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: any,
    @InjectRepository(Product)
    private readonly productRepository: any,
    @InjectRepository(User)
    private readonly userRepository: any,
  ) {}

  async create(createCartDto: CreateCartDto,userId:any): Promise<Cart> {
    const {  productId, quantity } = createCartDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.qty < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    product.qty -= quantity;
    await this.productRepository.save(product);

    const cartItem = this.cartRepository.create({ user, product, quantity });
    return this.cartRepository.save(cartItem);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({ where: { id }, relations: ['user', 'product'] });
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return cartItem;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cartItem = await this.findOne(id);
    const { quantity } = updateCartDto;

    if (quantity !== undefined) {
      const product = await this.productRepository.findOneBy({ id: cartItem?.product?.id });

      const newStockQuantity = product.qty + cartItem.quantity - quantity;
      if (newStockQuantity < 0) {
        throw new BadRequestException('Not enough stock available');
      }

      product.qty = newStockQuantity;
      await this.productRepository.save(product);

      cartItem.quantity = quantity;
    }

    return this.cartRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const cartItem = await this.findOne(id);

    const product = await this.productRepository.findOneBy({ id: cartItem?.product.id });
    product.qty += cartItem.quantity;
    await this.productRepository.save(product);

    await this.cartRepository.delete(id);
  }
}
