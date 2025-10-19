import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

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
    // Inicializar formulario
    this.fg = this.fb.group({
      search: ['', [Validators.required, Validators.minLength(1)]],
    });

    // Búsqueda en vivo
    this.liveSearch();
  }

  private liveSearch() {
    this.fg.get('search')!.valueChanges
      .pipe(
        debounceTime(200), //Para que haya tiempo entre busqueda y busqueda
        distinctUntilChanged(), //Para que no busque lo mismo.
        filter((q: string) => q !== null) //Filtramos los campos nulos
      )
      .subscribe({
        next: (q: string) => {
          const term = (q || '').trim();
          if (!term) { this.results = []; return; }
          this.productService.getList(`?name=${encodeURIComponent(term)}`).subscribe({
            next: (res) => (this.results = (res || []).slice(0, 6)),
            error: () => (this.results = []),
          });
        },
        error: (err) => console.error('Error en valueChanges:', err),
      });
  }

  // Enter: navegar a la lista filtrada
  onSubmit() {
 
    const q = (this.fg.value.search || '').trim();
    if (!q) return;
    this.results = [];

    this.router.navigate(['/search', q]);
  }

  // Click en sugerencia: navegar usando ese nombre
  selectSuggestion(product: Product) {
    this.fg.patchValue({ search: product.name });
    this.results = [];
  
    this.router.navigate(['/search', product.name]);
  }
}
