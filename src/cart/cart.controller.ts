import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, HttpCode, HttpStatus, UseGuards,Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../../utils/api-response';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Req() req: any) {
    const userId:any = req.user;
    const cartItem = await this.cartService.create(createCartDto,userId.id);
    return new ApiResponse(HttpStatus.CREATED, 'Cart item created successfully', cartItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const cartItems = await this.cartService.findAll();
    return new ApiResponse(HttpStatus.OK, 'Cart items retrieved successfully', cartItems);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const cartItem = await this.cartService.findOne(id);
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return new ApiResponse(HttpStatus.OK, 'Cart item retrieved successfully', cartItem);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    const updatedCartItem = await this.cartService.update(id, updateCartDto);
    if (!updatedCartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return new ApiResponse(HttpStatus.OK, 'Cart item updated successfully', updatedCartItem);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.cartService.remove(id);
  }
}
