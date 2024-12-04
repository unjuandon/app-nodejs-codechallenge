import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTransactionInput } from 'src/dto/create-transaction-input.';

@Injectable()
export class TransactionService {
  private readonly transactionMicroserviceUrl = 'http://localhost:3000/transactions';

  async createTransaction(data: CreateTransactionInput) {
    const response = await axios.post(`${this.transactionMicroserviceUrl}`, data);
    return response.data;
  }

  async getTransactionById(id: string) {
    const response = await axios.get(`${this.transactionMicroserviceUrl}/${id}`);
    return response.data;
  }
}
