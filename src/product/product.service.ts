import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, DeleteResult,Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: string = 'created_at',
    order: 'ASC' | 'DESC' = 'ASC',
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<{ data: Product[], count: number }> {
    const queryOptions: FindManyOptions<Product> = {
      skip: (page - 1) * limit,
      take: limit,
      order: {
        ['created_at']: order,
      },
    };

    if (category) {
      queryOptions.where = { ...queryOptions.where, category };
    }

    if (minPrice || maxPrice) {
      queryOptions.where = {
        ...queryOptions.where,
        price: minPrice && maxPrice ? Between(minPrice, maxPrice) : minPrice ? MoreThanOrEqual(minPrice) : LessThanOrEqual(maxPrice),
      };
    }

    const [result, total] = await this.productRepository.findAndCount(queryOptions);
    return { data: result, count: total };
  }


  async findOne(id: any): Promise<Product | undefined> {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | undefined> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10): Promise<{ data: Product[], count: number }> {
    const [result, total] = await this.productRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: result, count: total };
  }
}
