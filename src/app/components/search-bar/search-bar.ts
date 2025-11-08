import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fg = this.fb.group({
      search: [''],
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
            size:6
          }

          this.productService.getList(params).subscribe({
            next: (res) => (this.results = (res.data || [])),
            error: () => (this.results = []),
          });
        },
        error: (err) => console.error('Error en valueChanges:', err),
      });
  }

  onSubmit(): void {
    const q = (this.fg.value.search || '').trim();
    this.results = [];

    const currentFilters = this.route.snapshot.queryParams;

    const filters: ProductParams = { ...currentFilters, page: 0 };

    delete (filters as any).name;
    delete (filters as any).productOrCategory;

    if (q) {
      filters.name = q;
    }

    this.router.navigate(['/products'], { queryParams: filters });
    this.fg.clearValidators();
  }

  selectSuggestion(product: Product): void {
    this.fg.reset()
    this.results = [];

    const currentFilters = this.route.snapshot.queryParams;
    const filters: ProductParams = { ...currentFilters, page: 0, name: product.name };

    delete (filters as any).productOrCategory;

    this.router.navigate(['/products/details/',product.id] );
  }
}
