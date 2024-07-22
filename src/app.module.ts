import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


console.log("__dirname : ", __dirname);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'postgres', 'sqlite', etc.
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ecommerce',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // synchronize: false, // Set to false in production
      // entities: [User, Product, Order, Cart]
    }),
    ProductModule,
    AuthModule,
    OrderModule,
    CartModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
