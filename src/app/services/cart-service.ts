import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<Product[]>([])

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
