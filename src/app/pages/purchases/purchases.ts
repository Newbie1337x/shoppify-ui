import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit-service';
import { SalesParams } from '../../models/filters/salesParams';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-purchases',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css'
})
export class Purchases implements OnInit {

  AService = inject(AuditService)
  aService = inject(AuthService)
  user = this.aService.user

  purchases = signal<Transaction[]>([])
  activePurchase = signal<number | null>(null)
  purchasesXPage = 10 | 25 | 50

  filters: SalesParams = {
    startDate: '',
    endDate: '',
    minTotal: undefined,
    maxTotal: undefined,
    paymentMethod: '',
    userId: this.user()?.id ?? 0
  }

  ngOnInit(): void {
    this.loadTransactions()
  }

  toggleDetails(i: number) {
    this.activePurchase.set(this.activePurchase() === i ? null : i)
  }

  applyFilters() {
    this.loadTransactions()
  }

  loadTransactions() {
    this.AService.getAllTransactions(0,this.purchasesXPage, this.filters).subscribe({
      next: (data) => this.purchases.set(data),
      error: (err) => console.error('Error al cargar compras:', err),
    })
  }

}
