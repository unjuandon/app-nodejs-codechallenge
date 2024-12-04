import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';



@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionService.createTransaction(createTransactionDto);
    return { transactionExternalId: transaction.transactionExternalId };
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
