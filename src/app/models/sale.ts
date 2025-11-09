export interface SaleRequest {
  clientId: number;
  transaction: TransactionRequest;
}

export interface TransactionRequest {
  paymentMethod: string;
  description: string;
  detailTransactions: DetailTransactionRequest[];
}

export interface DetailTransactionRequest {
  productID: number;
  quantity: number;
  subtotal: number;
}