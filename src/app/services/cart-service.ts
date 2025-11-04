import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { Transaction } from '../models/transaction';
import { ProductService } from './product-service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<Product[]>([])
  itemsInCart = computed(() => this.cartItems().length)
  
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
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El producto no tiene stock disponible"
              });
            }
          } else {
            items.push({ ...product, stock: 1 })
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

  updateQuantity(item: Product, newQty: number): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const quantity = Number(newQty) //esto pasa el imput que viene como string a numero

      if (quantity < 1) {
        reject(new Error("La cantidad mínima es 1"))
        return
      }

      this.productService.get(item.id).subscribe({
        next: (updatedProduct) => {
          if (quantity > updatedProduct.stock) {
            reject(new Error("Solo hay " + updatedProduct.stock + " unidades disponibles"))
          } else {
            const updatedCart = this.cartItems().map((i) =>
              i.id === item.id ? { ...i, stock: quantity } : i
            )
            this.cartItems.set(updatedCart)
            resolve(updatedCart)
          }
        },
        error: (err) => {
          console.error("Error verificando stock:", err)
          reject(new Error("No se pudo verificar el stock del producto"))
        },
      })
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

  prepareTransaction(formValue: any, selectedProducts?: Product[]): Transaction {
    const products = selectedProducts ?? this.cartItems();
    return {
      total: products.reduce((sum, item) => sum + item.price * item.stock, 0),
      dateTime: new Date().toString(),
      paymentMethod: formValue.paymentMethod === "" ? "CASH" : formValue.paymentMethod,
      description: formValue.description === "" ? "No description" : formValue.description,
      type: formValue.type === "" ? "SALE" : formValue.type,
      storeName: formValue.storeName === "" ? "Default Store" : formValue.storeName,
      detailTransactions: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.stock,
        subtotal: item.price
      }))
    }
  }
}
