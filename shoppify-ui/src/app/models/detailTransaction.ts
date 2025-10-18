import { Product } from "./product";

export interface DetailTransaction {
  id: number;
  quantity: number;
  subtotal: number;
  product: Product;
}