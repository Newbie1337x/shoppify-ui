import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit-service';
import { SalesParams } from '../../models/filters/salesParams';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';
import { ImageFallbackDirective } from '../../directives/image-fallback';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchases',
  imports: [CommonModule, FormsModule,ImageFallbackDirective],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css'
})
export class Purchases implements OnInit {

  AService = inject(AuditService)
  aService = inject(AuthService)
  router = inject(Router)
  user = this.aService.user
  isAdmin = this.aService.permits().includes('ADMIN')

  purchases = signal<Transaction[]>([])
  activePurchase = signal<number | null>(null)

  adminView = false
  purchasesXPage = 10
  currentPage = 0
  totalPages = 1

  filters: SalesParams = {
    startDate: '',
    endDate: '',
    paymentMethod: '',
    minPrice: undefined,
    maxPrice: undefined,
    clientId: this.user()?.id?.toString() ?? '',
    page: this.currentPage,
    size: this.purchasesXPage
  }

  ngOnInit(): void {
    this.loadTransactions()
  }

  toggleAdminView(): void {
    this.adminView = !this.adminView
    this.filters.clientId = this.adminView ? '' : this.user()?.id?.toString() ?? ''
    this.currentPage = 0
    this.loadTransactions()
  }

  applyFilters(): void {
    this.currentPage = 0
    this.filters.page = this.currentPage
    this.filters.size = this.purchasesXPage
    this.loadTransactions()
  }

   changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) return
    this.currentPage = page
    this.filters.page = this.currentPage
    this.filters.size = this.purchasesXPage
    this.loadTransactions()
  }

  toggleDetails(i: number): void {
    this.activePurchase.set(this.activePurchase() === i ? null : i)
  }

  loadTransactions(): void {
    this.filters.page = this.currentPage
    this.filters.size = this.purchasesXPage

    this.AService.getAllTransactions(this.filters).subscribe({
      next: (data) => {
        const sales = data._embedded?.saleResponseList || []
        this.purchases.set(sales.map((s: any) => ({
          id: s.transaction?.id,
          total: s.transaction?.total,
          dateTime: s.transaction?.dateTime,
          paymentMethod: s.transaction?.paymentMethod,
          description: s.transaction?.description,
          type: s.transaction?.type,
          storeName: s.transaction?.storeName,
          detailTransactions: s.transaction?.detailTransactions || []
        })))

        this.totalPages = data.page?.totalPages || 1
      },
      error: (err) => {
        console.error('Error al cargar compras :c', err)
        Swal.fire({
          icon: 'error',
          title: 'Ops..',
          text: 'Ocurrió un error al cargar las compras. Por favor, inténtalo de nuevo más tarde.',
        })
      }
    })
  }

  gotoDetailsProduct(id?:number){
   this.router.navigate(["/products/details", id]);
  }

}
