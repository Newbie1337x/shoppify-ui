import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { Transaction } from '../models/transaction';
import { ProductService } from './product-service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<Product[]>([]);
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.stock, 0)
  )

  constructor(private productService: ProductService) { }


  addToCart(product: Product) {
    this.productService.get(product.id).subscribe({
      next: updatedProduct => {
        if (updatedProduct.stock > 0) {
          const items = [...this.cartItems()];
          const existing = items.find(i => i.id === product.id)

          if (existing) {
            if (updatedProduct.stock > existing.stock) {
              existing.stock++
              updatedProduct.stock = updatedProduct.stock - 1
              this.productService.put(updatedProduct).subscribe()
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El producto no tiene stock disponible"
              });
            }
          } else {
            items.push({ ...product, stock: 1 })
            updatedProduct.stock = updatedProduct.stock - 1
            this.productService.put(updatedProduct).subscribe()
          }

          this.cartItems.set(items)
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El producto no tiene stock disponible"
          });
        }
      },
      error: err => console.error('Error verificando stock:', err)
    })
  }

  updateQuantity(item: Product, newQty: number) {
    this.productService.get(item.id).subscribe({
      next: updatedProduct => {
        const available = updatedProduct.stock + item.stock; // stock total posible
        if (newQty > available) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El producto no tiene stock disponible para la nueva cantidad"
          });
          return
        }

        const diff = newQty - item.stock
        updatedProduct.stock = updatedProduct.stock - diff

        this.productService.put(updatedProduct).subscribe(() => {
          const items = this.cartItems().map(i =>
            i.id === item.id ? { ...i, stock: newQty } : i
          )
          this.cartItems.set(items)
        })
      }
    })
  }

  removeFromCart(productId: number) {
    const product = this.cartItems().find(p => p.id === productId)
    if (product) {
      this.productService.get(productId).subscribe(p => {
        p.stock = p.stock + product.stock
        this.productService.put(p).subscribe()
      }
      )
    }
    this.cartItems.set(this.cartItems().filter(i => i.id !== productId))
  }

  clearCart() {
    this.cartItems().forEach(product =>
      this.productService.get(product.id).subscribe(p => {
        p.stock = p.stock + product.stock
        this.productService.put(p).subscribe()
      }
      )
    );
    this.cartItems.set([])
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
    }
  }
}
