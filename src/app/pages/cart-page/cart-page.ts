import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartProduct } from '../../models/cartProduct';
import { ProductService } from '../../services/product-service';
import { TransactionService } from '../../services/transaction-service';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-cart-page',
  imports: [],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{

  cartItems: CartProduct[] = []

  constructor(
    private pService: ProductService,
    private tService: TransactionService  
  ){}

  ngOnInit(): void {
    
  }

  total(){
    return this.cartItems.reduce((sum, prod) => sum + prod.subtotal, 0)
  }

  addToCart(product: Product){
    const exist = this.cartItems.find( p => p.productId === product.id)
    if(exist){
      exist.quantity++
      exist.subtotal = exist.quantity * exist.price
    } else{
      this.cartItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      })
    }
  }

  removeFromCart(id: number){
    this.cartItems = this.cartItems.filter(p => p.productId !== id)
  }

  prepareTransaction(pM: string, desc: string, type: string, store: string ): Transaction{
    return {
      total: this.total(),
      dateTime: new Date().toString(),
      paymentMethod: pM,
      description: desc,
      type: type,
      storeName: store,
      detailTransactions: this.cartItems.map( prod => ({
        quantity: prod.quantity,
        subtotal: prod.subtotal,
        productId: prod.productId
      }))
    }
  }

  checkout(
    paymentMethod: string,
    description: string,
    type: string,
    storeName: string){
    const transaction = this.prepareTransaction(paymentMethod,description,type,storeName)
    this.tService.post(transaction).subscribe({
      next: (transaction) => {
    console.log('Transacción lista:', transaction);
  },
    error: (err) => console.error('Error preparando transacción', err)
  });
  }
}
