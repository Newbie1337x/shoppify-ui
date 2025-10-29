import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { Product } from '../../models/product';
import { ProductParams } from '../../models/filters/productParams';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit {
  fg!: FormGroup;
  results: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fg = this.fb.group({
      search: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.liveSearch();
  }

  private liveSearch(): void {
    this.fg.get('search')!
      .valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((q: string) => q !== null)
      )
      .subscribe({
        next: (q: string) => {
          const term = (q || '').trim();
          if (!term) {
            this.results = [];
            return;
          }

          const params : ProductParams = {
            productOrCategory:q,
            page:0,
            size:6,
            
          }

          this.productService.getList(params).subscribe({
            next: (res) => (this.results = (res || []).slice(0, 6)),
            error: () => (this.results = []),
          });
        },
        error: (err) => console.error('Error en valueChanges:', err),
      });
  }

  onSubmit(): void {
    const q = (this.fg.value.search || '').trim();
    if (!q) return;
    this.results = [];

    const filters: ProductParams = { productOrCategory: q,page:0 };
    this.router.navigate(['/products'], { queryParams: filters });
  }

  selectSuggestion(product: Product): void {
    this.fg.patchValue({ search: product.name });
    this.results = [];

    const filters: ProductParams = {productOrCategory: product.name };
    this.router.navigate(['/products'], { queryParams: filters });
  }
}
