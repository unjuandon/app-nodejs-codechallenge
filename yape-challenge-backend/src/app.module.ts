import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { Transaction } from './transaction/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'juan',
      password: 'juan',
      database: 'yape',
      entities: [Transaction],
      synchronize: true, // Solo para desarrollo
    }),
    TransactionModule, AntiFraudModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
