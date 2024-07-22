import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)

  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column('simple-array')
  productIds: string[];

  @Column('decimal')
  totalAmount: number;

  @Column({ default: 'pending' })
  status: string;
}
