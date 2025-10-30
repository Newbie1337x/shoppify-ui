import { Component, HostListener, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { ProductService } from '../../services/product-service';
import { ProductParams } from '../../models/filters/productParams';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-refiner',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './products-refiner.html',
  styleUrl: './products-refiner.css',
})
export class ProductsRefiner implements OnInit {
  form!: FormGroup;
  name!: FormControl;
  brand!: FormControl;
  price!: FormControl;
  category!: FormControl;
  nameSort!: FormControl;
  priceSort!: FormControl;

  products: Product[] = [];
  categories = input.required<Category[]>();

  refinedProducts = output<ProductParams>()
  filters!: ProductParams;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      brand: [''],
      price: [''],
      category: [[]],
      nameSort: [''],
      priceSort: ['']
    });
    this.name = this.form.get('name') as FormControl;
    this.brand = this.form.get('brand') as FormControl;
    this.price = this.form.get('price') as FormControl;
    this.category = this.form.get('category') as FormControl;
    this.nameSort = this.form.get('nameSort') as FormControl;
    this.priceSort = this.form.get('priceSort') as FormControl;

    this.refineProducts();
  }

  refineProducts() {
    combineLatest([
      this.name.valueChanges.pipe(startWith('')),
      this.brand.valueChanges.pipe(startWith('')),
      this.price.valueChanges.pipe(startWith('')),
      this.category.valueChanges.pipe(startWith([])),
      this.nameSort.valueChanges.pipe(startWith(null)),
      this.priceSort.valueChanges.pipe(startWith(null)),
    ])
      .pipe(
        debounceTime(300),
        map(([name, brand, price, categories, nameSort, priceSort]) => {
          const sort = nameSort
            ? `name,${nameSort}`
              : priceSort
            ? `price,${priceSort}`
              : null;
          return {
            name: name?.trim() || null,
            brand: brand?.trim() || null,
            priceLess: price?.trim() && !isNaN(Number(price)) ? Number(price) : null,
            categories: categories?.length ? categories : null,
            sort,
            page: 0,
            size: 6,
          } as ProductParams;
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(params => {
          this.filters = params;
        }),
        switchMap(params => {
          const cleanParams: any = {};
          Object.entries(params).forEach(([key, val]) => {
            if (val !== null && val !== undefined && val !== '') {
              cleanParams[key] = val;
            }
          });
          this.filters = cleanParams as ProductParams;

          return this.productService.getList(cleanParams).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe({
        next: data => (this.products = data || []),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un problema al obtener los productos',
            confirmButtonText: 'Volver',
            confirmButtonColor: '#4338ca'
          });
        }
      });
  }

  onSubmit() {
    if (this.filters) {
      this.refinedProducts.emit(this.filters)
      this.router.navigate(['/products'], { queryParams: this.filters})
    }
  }
}