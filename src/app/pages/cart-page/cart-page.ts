import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart-service';
import { ProductCard } from "../../components/product-card/product-card";
import { Product } from '../../models/product';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [ReactiveFormsModule, ProductCard],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit {

  private aService = inject(AuthService)
  private tService = inject(TransactionService)
  private fb = inject(FormBuilder)
  private cService = inject(CartService)
  private router = inject(Router)

  checkoutForm!: FormGroup
  permits = this.aService.permits()
  selectedItems = signal<Set<number>>(new Set())

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

  async changeQuantity(item: Product, unidad: number) {
    const newQty = item.stock + unidad
    if (newQty < 1) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad mínima alcanzada",
        text: "No puedes tener menos de 1 unidad."
      });
      return
    }

    try {
      await this.cService.updateQuantity(item, newQty)

    } catch (e: any) {
      Swal.fire({
        icon: "warning",
        title: "Oops..",
        text: e.message ?? "Hubo un error al actualizar la cantidad"
      })
    }
  }


  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems().length) {
      const payload = this.cService.prepareTransaction(this.checkoutForm.value);
      console.log("Payload a enviar :", payload);

      this.tService.post(payload).subscribe({
        next: (transaction) => {
          console.log("Transacción lista: ", transaction);
          this.selectedItems.set(new Set());
          this.cService.clearCart();
          this.checkoutForm.reset();

          Swal.fire({
            icon: "success",
            title: "Okey!",
            text: "Transacción realizada correctamente"
          }).then(() => {
            Swal.fire({
              title: "¿Ver compras?",
              text: "También puedes quedarte por aquí",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Ir a compras",
              cancelButtonText: "Permanecer en tu carrito",
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/compras']);
              }
            });
          });
        },
        error: (e) => {
          console.error("Error preparando transacción", e);
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: "Hubo un error al realizar la transacción",
            footer: e
          });
        }
      });
    }
  }
}
