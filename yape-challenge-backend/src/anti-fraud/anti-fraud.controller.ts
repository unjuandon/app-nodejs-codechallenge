import { Controller, OnModuleInit } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly antiFraudService: AntiFraudService,
  ) {}

  async onModuleInit() {
    // Suscribirse al evento de creación de transacciones
    this.kafkaService.subscribe('transaction-created', async (transaction) => {
      await this.antiFraudService.validateTransaction(transaction);
    });
  }
}
