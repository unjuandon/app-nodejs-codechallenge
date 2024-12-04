import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;

  @Field()
  transactionStatus: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;
}