import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TransactionModule } from './transaction/transaction.module';
import { ApolloDriver } from '@nestjs/apollo';
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Genera el esquema automáticamente
      playground: true, // Habilita el playground de GraphQL
    }),
    TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
