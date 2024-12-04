export class TransactionStatusUpdateEvent {
    transactionExternalId: string;
    status: 'approved' | 'rejected';
  }
  