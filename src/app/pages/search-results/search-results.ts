import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResults implements OnInit, OnDestroy {
  term = '';
  loading = false;
  results: Product[] = [];
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const q = (params.get('q') || '').trim();
      this.term = q;
      if (!q) {
        this.results = [];
        return;
      }
      this.fetch(q);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private fetch(q: string) {
    this.loading = true;
    this.productService.getList(`?name=${encodeURIComponent(q)}`).subscribe({
      next: (res) => {
        this.results = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.results = [];
        this.loading = false;
      }
    });
  }
}

