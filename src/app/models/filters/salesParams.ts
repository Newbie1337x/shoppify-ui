
export interface SalesParams {
  saleId?: string;
  clientId?: string;
  transactionId?: string;
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  minTotal?: number;
  maxTotal?: number;
}