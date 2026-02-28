import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('deleted_transactions')
export class DeletedTransaction {
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @Column()
  originalId: string;

  @Column()
  type: 'income' | 'expense';

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  createdAt: Date;

  @CreateDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}
