import { Product } from "./product";

export interface DetailTransaction {
  quantity: number;
  subtotal: number;
  productId: number;
}