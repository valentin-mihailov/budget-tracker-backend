import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entity/transaction.entity';
import { User } from 'src/entity/user.entity';
import { DeletedTransaction } from 'src/entity/deleted-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, DeletedTransaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
