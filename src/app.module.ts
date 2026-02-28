import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from './entity/transaction.entity';
import { User } from './entity/user.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { DeletedTransaction } from './entity/deleted-transaction.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Transaction, DeletedTransaction],
      synchronize: true,
    }),
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
