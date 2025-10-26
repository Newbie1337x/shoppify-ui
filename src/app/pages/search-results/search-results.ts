import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResults implements OnInit, OnDestroy {
  results: Product[] = [];
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const q = (params.get('q') || '').trim();
      
      if (!q) {
        this.results = [];
        return;
      }
      this.loadResults(q);
    });
  }

  //Limpiar memoria.
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadResults(q: string) {
    this.productService.getList(`?name=${encodeURIComponent(q)}`).subscribe({
      next: (res) => {
        this.results = res || [];
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.results = [];
      }
    });
  }
}
