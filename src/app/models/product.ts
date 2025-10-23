import { HalResource } from "./hal/halResource";

export interface Product extends HalResource{
  id: number;
  name: string;
  price: number;
  unitPrice: number;
  stock: number;
  sku: string;
  barcode: string;
  description: string;
  brand: string;
  imgURL: string;
  categories: string[];
  providers: number[];
}
