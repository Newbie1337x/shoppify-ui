import { Component, computed, OnInit } from '@angular/core';
import { CartProduct } from '../../models/cartProduct';
import { TransactionService } from '../../services/transaction-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-page',
  imports: [ReactiveFormsModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{

  checkoutForm!: FormGroup
  isAdmin = false

  constructor(
    private tService: TransactionService,
    private fb: FormBuilder,
    private cService: CartService
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      paymentMethod: ["CASH", Validators.required],
      type: ["SALE", Validators.required],
      storeName: ["", Validators.required],
      description: [""]
    })
  }

  get cartItems() {
    return this.cService.cartItems;
  }

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.subtotal, 0)
  )

  removeFromCart(id: number) {
    this.cService.removeFromCart(id)
  }

  updateQuantity(item: CartProduct, newQty: number) {
    this.cService.updateQuantity(item, newQty)
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems().length) {
      const payload = this.cService.prepareTransaction(this.checkoutForm.value)
      console.log("Payload a enviar :", payload)
      this.tService.post(payload).subscribe({
        next: (transaction) => console.log("Transacción lista: ", transaction),
        error: (e) => console.error("Error preparando transacción", e)
      })
    }
  }
}
