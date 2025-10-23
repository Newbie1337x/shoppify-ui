import { Component, computed, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CartProduct } from '../../models/cartProduct';
import { ProductService } from '../../services/product-service';
import { TransactionService } from '../../services/transaction-service';
import { Transaction } from '../../models/transaction';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart-page',
  imports: [ReactiveFormsModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{

  cartItems = signal<CartProduct[]>([])
  checkoutForm!: FormGroup;

  constructor(
    private pService: ProductService,
    private tService: TransactionService,
    private fb: FormBuilder  
  ){}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      paymentMethod: ['CASH', Validators.required],
      type: ['SALE', Validators.required],
      storeName: ['', Validators.required],
      description: ['']
    });
  }

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.subtotal, 0)
  )

  addToCart(product: Product){
    const items = [...this.cartItems()];
    const existing = items.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.price;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      });
    }
    this.cartItems.set(items);
  }

  removeFromCart(id: number){
    this.cartItems.set(this.cartItems().filter(i => i.productId !== id));
  }

  prepareTransaction(): Transaction{
    const formValue = this.checkoutForm.value;
    return {
      total: this.total(),
      dateTime: new Date().toString(),
      paymentMethod: formValue.paymentMethod,
      description: formValue.description,
      type: formValue.type,
      storeName: formValue.storeName,
      detailTransactions: this.cartItems().map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };
  }

  onSubmit(){
    if (this.checkoutForm.valid && this.cartItems().length) {
      const payload = this.prepareTransaction();
      console.log('Payload a enviar:', payload);
      this.tService.post(payload).subscribe({
        next: (transaction) => {
          console.log('Transacción lista:', transaction);
        },
        error: (err) => console.error('Error preparando transacción', err)
      });
    }}

   updateQuantity(item: CartProduct, newQty: number) {
    const items = [...this.cartItems()];
    const idx = items.findIndex(i => i.productId === item.productId);
    if (idx >= 0) {
      items[idx].quantity = newQty;
      items[idx].subtotal = newQty * items[idx].price;
      this.cartItems.set(items);
    }
  }
}
