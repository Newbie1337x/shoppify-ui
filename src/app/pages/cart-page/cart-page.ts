import { Component, computed, OnInit, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart-service';
import { ProductCard } from "../../components/product-card/product-card";
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-cart-page',
  imports: [ReactiveFormsModule, ProductCard],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{

  checkoutForm!: FormGroup
  isAdmin = false

  selectedItems = signal<Set<number>>(new Set())

  constructor(
    private tService: TransactionService,
    private fb: FormBuilder,
    private cService: CartService,
    private aServuce: AuthService
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
    this.cartItems().reduce((sum, item) => sum + item.price * item.stock, 0)
  )

  selectedTotal = computed(() => {
    const selected = this.selectedItems()
    return this.cartItems().reduce((sum, item) => {
      if (selected.has(item.id)) sum += item.price * item.stock
      return sum
    }, 0)
  })

  toggleSelection(id: number, checked: boolean) {
    const updated = new Set(this.selectedItems())
    if (checked) updated.add(id)
    else updated.delete(id)
    this.selectedItems.set(updated)
  }

  removeFromCart(id: number) {
    this.cService.removeFromCart(id)
    const updated = new Set(this.selectedItems())
    updated.delete(id)
    this.selectedItems.set(updated)
  }

  removeSelected() {
    const selected = this.selectedItems()
    this.cService.cartItems.update(items => items.filter(i => !selected.has(i.id)))
    this.selectedItems.set(new Set())
  }

  updateQuantity(item: Product, newQty: number) {
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
