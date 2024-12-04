import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { TransactionStatusUpdateEvent } from '../events/transaction-status-update.event';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(private readonly kafkaService: KafkaService) {}

  async validateTransaction(transaction: {
    transactionExternalId: string;
    value: number;
  }): Promise<void> {
    try {
      this.logger.log(
        `Validating transaction with ID: ${transaction.transactionExternalId}, Value: ${transaction.value}`,
      );

      const status = transaction.value > 1000 ? 'rejected' : 'approved';
      this.logger.log(
        `Transaction ${transaction.transactionExternalId} is ${status} based on the value: ${transaction.value}`,
      );

      // Publica el evento de actualización del estado
      const event: TransactionStatusUpdateEvent = {
        transactionExternalId: transaction.transactionExternalId,
        status,
      };

      this.logger.log(
        `Publishing status update event to Kafka for transaction ${transaction.transactionExternalId} with status: ${status}`,
      );
      await this.kafkaService.emit('transaction-status-updated', event);

      this.logger.log(
        `Successfully published status update event for transaction ${transaction.transactionExternalId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error while validating transaction ${transaction.transactionExternalId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
