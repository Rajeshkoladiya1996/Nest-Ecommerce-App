import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn ,OneToMany,Unique } from 'typeorm';
import { Order } from '../order/order.entity';
import { Cart } from '../cart/cart.entity';

@Entity()
@Unique(["email"])  // Ensure email is unique
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column({ default: 0 })
  status: number;

  @OneToMany(() => Cart, cart => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
