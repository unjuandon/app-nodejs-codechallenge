import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';
import { CreateTransactionInput } from '../dto/create-transaction-input.';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => Transaction, { name: 'transaction' })
  async getTransaction(@Args('id', { type: () => String }) id: string): Promise<Transaction> {
    const transaction = await this.transactionService.getTransactionById(id);

    // Ensure transactionStatus is populated properly
    if (!transaction.transactionStatus) {
      transaction.transactionStatus = { name: 'unknown' }; // Fallback value
    }

    return transaction;
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const transaction = await this.transactionService.createTransaction(createTransactionInput);

    // Ensure transactionStatus is populated properly
    if (!transaction.transactionStatus) {
      transaction.transactionStatus = { name: 'unknown' }; // Fallback value
    }

    return transaction;
  }
}
