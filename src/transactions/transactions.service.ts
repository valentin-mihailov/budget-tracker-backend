import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionDto } from 'src/dto/transaction.dto';
import { Transaction } from 'src/entity/transaction.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getBalance(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    });

    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    });

    return transactions;
  }

  async addTransaction(userId: string, transactionData: TransactionDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const newTransaction = await this.transactionRepository.create({
      ...transactionData,
      user,
    });

    return await this.transactionRepository.save(newTransaction);
  }
  async deleteTransaction(userId: string, transactionId: string) {
    const deleteResult = await this.transactionRepository.delete({
      id: transactionId,
      user: { id: userId },
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found for this user`,
      );
    }

    return;
  }
}
