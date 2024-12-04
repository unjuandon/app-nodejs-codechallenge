import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => Int)
  value: number;

  @Field()
  transactionStatus: string;

  @Field()
  createdAt: Date;
}
