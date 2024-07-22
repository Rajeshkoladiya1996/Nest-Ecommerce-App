import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpCode, HttpStatus, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { CommonResponse } from './common-response.interface';  // Adjust path as needed
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Adjust path as needed
import { ApiResponse } from '../../utils/api-response';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('sort') sort: string = 'createdAt', // default sorting field
  @Query('order') order: 'ASC' | 'DESC' = 'ASC', // default sorting order
  @Query('category') category?: string, // optional filter
  @Query('minPrice') minPrice?: number, // optional filter
  @Query('maxPrice') maxPrice?: number // optional filter
): Promise<CommonResponse<{ data: Product[], count: number }>> {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
    throw new BadRequestException('Invalid pagination parameters');
  }

  const result = await this.productService.findAll(
    pageNumber,
    limitNumber,
    sort,
    order,
    category,
    minPrice,
    maxPrice
  );
  return new ApiResponse( HttpStatus.OK, 'Products retrieved successfully',result);

}

  @Get('/user/:userId')
  @UseGuards(JwtAuthGuard)  // Require authentication for this endpoint
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<CommonResponse<{ data: Product[], count: number }>> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const result = await this.productService.findByUser(userId, pageNumber, limitNumber);
    return new ApiResponse( HttpStatus.OK, 'Products retrieved successfully',result);
  }

  @Post()
  @UseGuards(JwtAuthGuard)  // Require authentication for this endpoint
  async create(@Body() createProductDto: CreateProductDto): Promise<CommonResponse<Product>> {
    const product = await this.productService.create(createProductDto);
    return new ApiResponse(  HttpStatus.CREATED, 'Product created successfully',product);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommonResponse<Product>> {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return new ApiResponse(  HttpStatus.OK,'Product retrieved successfully',product);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)  // Require authentication for this endpoint
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<CommonResponse<Product>> {
    const updatedProduct = await this.productService.update(id, updateProductDto);
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return new ApiResponse(  HttpStatus.OK,'Product updated successfully',updatedProduct);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)  // Require authentication for this endpoint
  async remove(@Param('id') id: string): Promise<CommonResponse<void>> {
    const result: any = await this.productService.remove(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return new ApiResponse(  HttpStatus.NO_CONTENT,'Product deleted successfully');
  }
}
