import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  tranferTypeId: number;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'varchar', default: 'pending' })
  transactionStatus: string; // Valores: pending, approved, rejected

  @CreateDateColumn()
  createdAt: Date;
}
