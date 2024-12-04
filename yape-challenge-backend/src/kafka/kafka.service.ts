import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'yape-group' });
  }

  async emit(topic: string, message: any): Promise<void> {
    try {
      this.logger.log(`Connecting producer to Kafka...`);
      await this.producer.connect();
      this.logger.log(`Producer connected. Sending message to topic "${topic}"`);
      
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      this.logger.log(`Message sent to topic "${topic}": ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic "${topic}": ${error.message}`, error.stack);
      throw error;
    }
  }

  async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
    try {
      this.logger.log(`Connecting consumer to Kafka...`);
      await this.consumer.connect();
      this.logger.log(`Consumer connected. Subscribing to topic "${topic}"`);

      await this.consumer.subscribe({ topic, fromBeginning: true });
      this.logger.log(`Consumer subscribed to topic "${topic}"`);

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const value = JSON.parse(message.value.toString());
            this.logger.log(
              `Received message from topic "${topic}", partition ${partition}: ${JSON.stringify(value)}`
            );
            await callback(value);
          } catch (callbackError) {
            this.logger.error(`Error in message callback: ${callbackError.message}`, callbackError.stack);
          }
        },
      });
      this.logger.log(`Consumer is running for topic "${topic}"`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic "${topic}": ${error.message}`, error.stack);
      throw error;
    }
  }
}

