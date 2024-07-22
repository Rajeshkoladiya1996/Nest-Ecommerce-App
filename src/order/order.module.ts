import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { UserModule } from '../user/user.module'; // Assuming you have a User module

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule, // Import User module for UserService injection
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
