import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaModule } from 'src/kafka/kafka.module';
@Module({
  imports:[KafkaModule],
  providers: [AntiFraudService],
  exports:[AntiFraudService],
})
export class AntiFraudModule {}
