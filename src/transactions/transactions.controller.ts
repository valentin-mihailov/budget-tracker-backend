import { Controller, Delete, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from 'src/dto/transaction.dto';

@Controller('users/:userId')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(`balance`)
  async getBalance(@Param(`userId`) userId: string) {
    return this.transactionsService.getBalance(userId);
  }

  @Get(`transactions`)
  async getTransactions(@Param(`userId`) userId: string) {
    return this.transactionsService.getTransactions(userId);
  }

  @Post(`transactions`)
  async addNewTransaction(
    @Param(`userId`) userId: string,
    @Body() transactionDto: TransactionDto,
  ) {
    return this.transactionsService.addTransaction(userId, transactionDto);
  }

  @Delete(`transactions/:transactionId`)
  async deleteTransactionById(
    @Param(`userId`) userId: string,
    @Param(`transactionId`) transactionId: string,
  ) {
    return this.transactionsService.deleteTransaction(userId, transactionId);
  }
}
