import { globalParams } from "./globalParams";

export interface SalesParams extends globalParams {
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
  paymentMethod?: string;
  userId?: number;
}