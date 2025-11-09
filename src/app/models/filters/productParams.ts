import { globalParams } from "./globalParams";

export interface ProductParams extends globalParams {
  // --- Filtros de Texto ---
  name?: string;
  description?: string;
  barcode?: string;
  sku?: string;
  brand?: string;
  provider?: string;
  category?: string;


  productOrCategory?: string;

  // --- Filtros de Múltiples Valores ---
  categories?: string;
  providers?: string;

  // --- Filtros Numéricos y de Rango ---
  price?: number;
  stock?: number;
  discountGreater?: number;
  discountLess?: number | null;
  priceGreater?: number;
  priceLess?: number | null;
  stockGreaterThan?: number;
  stockLessThan?: number;
  priceBetween?: string;
  stockBetween?: string;
  discountBetween?: string;
}