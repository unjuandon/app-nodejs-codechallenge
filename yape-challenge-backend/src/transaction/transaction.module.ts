import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';
import { Repository } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Kafka } from 'kafkajs';
import { KafkaModule } from 'src/kafka/kafka.module';
import { AntiFraudModule } from 'src/anti-fraud/anti-fraud.module';

@Module({
  imports:[TypeOrmModule.forFeature([Transaction]), KafkaModule, AntiFraudModule],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
