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
    const user = await this.userRepository.findOneBy({ id: userId });
    return user.balance;
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

    if (transactionData.type === 'income') {
      user.balance = Number(user.balance) + transactionData.amount;
    } else {
      user.balance = Number(user.balance) - transactionData.amount;
    }

    await this.userRepository.save(user);

    return await this.transactionRepository.save(newTransaction);
  }
  async deleteTransaction(userId: string, transactionId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, user: { id: userId } },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const user = await this.userRepository.findOneBy({ id: userId });

    const currentBalance = Number(user.balance);
    const transactionAmount = Number(transaction.amount);

    const adjustment =
      transaction.type === 'income' ? -transactionAmount : transactionAmount;

    user.balance = currentBalance + adjustment;

    await this.userRepository.save(user);
    await this.transactionRepository.remove(transaction);

    return { message: 'Transaction deleted' };
  }
}
