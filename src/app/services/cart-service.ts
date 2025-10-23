import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartProduct } from '../models/cartProduct';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartProduct[]>([])

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.subtotal, 0)
  )

  addToCart(product: Product) {
    const items = [...this.cartItems()]
    const existing = items.find(i => i.productId === product.id)

    if (existing) {
      existing.quantity++
      existing.subtotal = existing.quantity * existing.price
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      });
    }

    this.cartItems.set(items)
  }

  removeFromCart(productId: number) {
    this.cartItems.set(this.cartItems().filter(i => i.productId !== productId))
  }

  updateQuantity(item: CartProduct, newQty: number) {
    const items = [...this.cartItems()]
    const idx = items.findIndex(i => i.productId === item.productId)
    if (idx >= 0) {
      items[idx].quantity = newQty
      items[idx].subtotal = newQty * items[idx].price
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
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };
  }
}
