import { IsUUID, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: Date;
}
