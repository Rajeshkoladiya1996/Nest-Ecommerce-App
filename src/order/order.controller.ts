import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpCode, HttpStatus, NotFoundException, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming you have JWT authentication
import { ApiResponse } from '../../utils/api-response';
import { Request } from 'express';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto): Promise<any> {
    const userId = req.user['id'];
    const order = await this.orderService.create(userId, createOrderDto);
    return new ApiResponse(HttpStatus.CREATED, 'Cart item created successfully', order);
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<any> {
    const { data, count } = await this.orderService.findAll(Number(page), Number(limit));
    return new ApiResponse( HttpStatus.OK, 'Orders retrieved successfully', { data, count });

  }

  @Get('/user/:userId')
  async findByUser(
    @Param('userId') userId: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<any> {
    const { data, count } = await this.orderService.findByUser(userId, Number(page), Number(limit));
    return new ApiResponse( HttpStatus.OK, 'User orders retrieved successfully', { data, count });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return new ApiResponse( HttpStatus.OK, 'Order retrieved successfully',order);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<any> {
    const updatedOrder = await this.orderService.update(id, updateOrderDto);
    return new ApiResponse( HttpStatus.OK, 'Order updated successfully',updatedOrder);

  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.orderService.remove(id);
    return new ApiResponse( HttpStatus.NO_CONTENT, 'Order deleted successfully');
  }
}
