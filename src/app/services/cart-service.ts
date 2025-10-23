import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<Product[]>([
  {
    "id": 1,
    "name": "Leche Entera La Serenísima 1L",
    "price": 950,
    "unitPrice": 950,
    "stock": 120,
    "sku": "LS-001",
    "barcode": "7791234000012",
    "description": "Leche entera pasteurizada La Serenísima de 1 litro, ideal para desayunos.",
    "brand": "La Serenísima",
    "imgURL": "https://cdn.laserenisima.com.ar/images/products/leche-entera-1l.jpg",
    "categories": ["Lácteos", "Bebidas"],
    "providers": [1, 3]
  },
  {
    "id": 2,
    "name": "Yerba Mate Amanda 1kg",
    "price": 3500,
    "unitPrice": 3500,
    "stock": 80,
    "sku": "YM-002",
    "barcode": "7792716000104",
    "description": "Yerba mate Amanda de 1 kilogramo con estacionamiento natural.",
    "brand": "Amanda",
    "imgURL": "https://cdn.amanda.com.ar/images/yerba-mate-1kg.jpg",
    "categories": ["Infusiones", "Alimentos"],
    "providers": [2]
  },
  {
    "id": 3,
    "name": "Aceite de Girasol Natura 1L",
    "price": 2200,
    "unitPrice": 2200,
    "stock": 200,
    "sku": "AG-003",
    "barcode": "7790070400200",
    "description": "Aceite de girasol Natura 100% puro, ideal para cocinar y freír.",
    "brand": "Natura",
    "imgURL": "https://cdn.natura.com.ar/images/products/aceite-girasol-1l.jpg",
    "categories": ["Aceites", "Cocina"],
    "providers": [3, 5]
  },
  {
    "id": 4,
    "name": "Queso Cremoso Sancor 500g",
    "price": 2800,
    "unitPrice": 2800,
    "stock": 60,
    "sku": "QC-004",
    "barcode": "7793940444006",
    "description": "Queso cremoso Sancor en presentación de 500 gramos, ideal para sandwiches.",
    "brand": "Sancor",
    "imgURL": "https://cdn.sancor.com.ar/images/products/queso-cremoso-500g.jpg",
    "categories": ["Lácteos", "Quesos"],
    "providers": [4]
  },
  {
    "id": 5,
    "name": "Pan de Campo Artesanal",
    "price": 1200,
    "unitPrice": 1200,
    "stock": 45,
    "sku": "PC-005",
    "barcode": "7798999999005",
    "description": "Pan artesanal de campo con masa madre, horneado diariamente.",
    "brand": "Panadería El Trigal",
    "imgURL": "https://cdn.eltrigal.com.ar/images/products/pan-campo-artesanal.jpg",
    "categories": ["Panadería", "Alimentos"],
    "providers": [6]
  }
]
)

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price, 0)
  )

  addToCart(product: Product) {
    const items = [...this.cartItems()]
    const existing = items.find(i => i.id === product.id)

    if (existing) {
      existing.stock++
      existing.price = existing.stock * existing.price
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: 1,
        unitPrice: product.price,
        sku: product.sku,
        barcode: product.barcode,
        description: product.description,
        brand: product.brand,
        imgURL: product.imgURL,
        categories: product.categories,
        providers: product.providers
      })
    }

    this.cartItems.set(items)
  }

  removeFromCart(productId: number) {
    this.cartItems.set(this.cartItems().filter(i => i.id !== productId))
  }

  updateQuantity(item: Product, newQty: number) {
    const items = [...this.cartItems()]
    const idx = items.findIndex(i => i.id === item.id)
    if (idx >= 0) {
      items[idx].stock = newQty
      items[idx].price = newQty * items[idx].price
      this.cartItems.set(items)
    }
  }

  prepareTransaction(formValue: any): Transaction {
    return {
      total: this.total(),
      dateTime: new Date().toString(),
      paymentMethod: formValue.paymentMethod === ""? "CASH": formValue.paymentMethod,
      description: formValue.description === ""? "No description": formValue.description,
      type: formValue.type === ""? "SALE": formValue.type,
      storeName: formValue.storeName === ""? "Default Store": formValue.storeName,
      detailTransactions: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.stock,
        subtotal: item.price
      }))
    };
  }
}
