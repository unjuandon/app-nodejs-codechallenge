import {
    Injectable,
    NotFoundException,
    Logger,
    OnModuleInit,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Transaction } from './transaction.entity';
  import { CreateTransactionDto } from './transaction.dto';
  import { KafkaService } from '../kafka/kafka.service';
  import { AntiFraudService } from 'src/anti-fraud/anti-fraud.service';
  
  @Injectable()
  export class TransactionService implements OnModuleInit {
    private readonly logger = new Logger(TransactionService.name);
  
    constructor(
      @InjectRepository(Transaction)
      private readonly transactionRepository: Repository<Transaction>,
      private readonly kafkaService: KafkaService,
      private readonly antiFraudService: AntiFraudService 
    ) {}
  
    async onModuleInit() {
      try {
        this.logger.log('Subscribing to Kafka topic: transaction-status-updated');
        this.kafkaService.subscribe(
          'transaction-status-updated',
          async ({ transactionExternalId, status }) => {
            this.logger.log(
              `Received status update for transaction ${transactionExternalId}: ${status}`,
            );
            await this.updateTransactionStatus(transactionExternalId, status);
          },
        );
      } catch (error) {
        this.logger.error(
          `Error during Kafka subscription: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  
    async createTransaction(
      createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
      try {
        this.logger.log(
          `Creating transaction with data: ${JSON.stringify(createTransactionDto)}`,
        );
  
        const transaction = this.transactionRepository.create({
          ...createTransactionDto,
          transactionStatus: 'pending', 
          createdAt: new Date(),
        });
  
        const savedTransaction = await this.transactionRepository.save(transaction);
  
        this.logger.log(
          `Transaction ${savedTransaction.transactionExternalId} created successfully with status: pending`,
        );
  
        // Emitir evento a Kafka para validar transacción
        this.logger.log(
          `Emitting transaction-created event for transaction ${savedTransaction.transactionExternalId}`,
        );
        await this.kafkaService.emit('transaction-created', {
          transactionExternalId: savedTransaction.transactionExternalId,
          value: savedTransaction.value,
        });

        const verifiedTransaction = await this.antiFraudService.validateTransaction(savedTransaction);

        this.logger.log(`VERIFIED TRANSACTION =====> ${verifiedTransaction}`)
        return savedTransaction;
      } catch (error) {
        this.logger.error(
          `Error creating transaction: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  
    async getTransactionById(
      transactionExternalId: string,
    ): Promise<Transaction> {
      try {
        this.logger.log(
          `Retrieving transaction with ID: ${transactionExternalId}`,
        );
  
        const transaction = await this.transactionRepository.findOneBy({
          transactionExternalId,
        });
  
        if (!transaction) {
          this.logger.warn(
            `Transaction with ID ${transactionExternalId} not found`,
          );
          throw new NotFoundException('Transaction not found');
        }
  
        this.logger.log(
          `Transaction ${transactionExternalId} retrieved successfully`,
        );
        return transaction;
      } catch (error) {
        this.logger.error(
          `Error retrieving transaction ${transactionExternalId}: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  
    async updateTransactionStatus(
      transactionExternalId: string,
      status: string,
    ): Promise<void> {
      try {
        this.logger.log(
          `Updating status for transaction ${transactionExternalId} to ${status}`,
        );
  
        const transaction = await this.transactionRepository.findOneBy({
          transactionExternalId,
        });
  
        if (!transaction) {
          this.logger.warn(
            `Transaction with ID ${transactionExternalId} not found for status update`,
          );
          throw new Error('Transaction not found');
        }
  
        transaction.transactionStatus = status;
        await this.transactionRepository.save(transaction);
  
        this.logger.log(
          `Transaction ${transactionExternalId} status updated successfully to ${status}`,
        );
      } catch (error) {
        this.logger.error(
          `Error updating status for transaction ${transactionExternalId}: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }
  