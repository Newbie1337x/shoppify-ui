import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit-service';
import { SalesParams } from '../../models/filters/salesParams';
import { FormsModule } from "@angular/forms";
import { ProductTable } from "../../components/product-table/product-table";

@Component({
  selector: 'app-purchases',
  imports: [CommonModule, FormsModule, ProductTable],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css'
})
export class Purchases implements OnInit {

  AService = inject(AuditService)
  aService = inject(AuthService)
  user = this.aService.user
  isAdmin = this.aService.permits().includes('ADMIN')
  adminView = false;

  purchases = signal<Transaction[]>([])
  activePurchase = signal<number | null>(null)
  purchasesXPage = 10

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

  viewToggle(): void {
    this.adminView = !this.adminView;
  }

  toggleDetails(i: number) {
    this.activePurchase.set(this.activePurchase() === i ? null : i)
  }

  applyFilters() {
    this.loadTransactions()
  }

  toogleAdminView() {
    this.filters.userId = this.isAdmin ? undefined : this.user()?.id ?? 0
    this.loadTransactions()
  }

  loadTransactions() {
    this.AService.getAllTransactions(0,this.purchasesXPage, this.filters).subscribe({
      next: (data) => {this.purchases.set(data),console.log(data)},
      error: (err) => console.error('Error al cargar compras:', err),
    })
  }

}
