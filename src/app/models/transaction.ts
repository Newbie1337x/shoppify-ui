import { DetailTransaction } from "./detailTransaction";

export interface Transaction {
  id: number;
  total: number;
  dateTime: string;  
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | string;
  description: string;
  type: 'SALE' | 'PURCHASE' | 'RETURN' | string;
  storeName: string;
  detailTransactions: DetailTransaction[];
}