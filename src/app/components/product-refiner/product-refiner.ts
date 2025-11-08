import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { Category } from '../../models/category';
import { ProductParams } from '../../models/filters/productParams';
import { CardBodyComponent, CardComponent, CollapseDirective } from '@coreui/angular';

type RefinerFormValue = {
  name: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  category: string[];
  nameSort: string;
  priceSort: string;
};

@Component({
  selector: 'app-products-refiner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    CardComponent,
    CardBodyComponent,
    CollapseDirective,
    CardBodyComponent
  ],
  templateUrl: 'product-refiner.html',
  styleUrls: ['product-refiner.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsRefiner implements OnInit, OnChanges {
  @Input() categories: Category[] = [];
  @Input() initialFilters: ProductParams = {};
  @Output() filterChange = new EventEmitter<ProductParams>();
  visible = false

  filtersForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.patchFormWithFilters(this.initialFilters);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilters'] && this.filtersForm) {
      this.patchFormWithFilters(this.initialFilters);
    }
  }

  onFiltersSubmit(): void {
    this.filterChange.emit(this.buildFiltersFromForm());
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  resetFilters(): void {
    this.filtersForm.reset({
      name: '',
      brand: '',
      priceMin: '',
      priceMax: '',
      category: [],
      nameSort: '',
      priceSort: ''
    });
    this.filterChange.emit({});
  }

  get hasActiveFilters(): boolean {
    if (!this.filtersForm) return false;

    const {
      name,
      brand,
      priceMin,
      priceMax,
      category,
      nameSort,
      priceSort
    } = this.filtersForm.getRawValue() as RefinerFormValue;

    return Boolean(
      this.cleanString(name) ||
      this.cleanString(brand) ||
      this.cleanString(priceMin) ||
      this.cleanString(priceMax) ||
      (Array.isArray(category) && category.length) ||
      this.cleanString(nameSort) ||
      this.cleanString(priceSort)
    );
  }

  private initForm(): void {
    this.filtersForm = this.fb.group({
      name: [''],
      brand: [''],
      priceMin: ['', [Validators.pattern('^[0-9]*$')]],
      priceMax: ['', [Validators.pattern('^[0-9]*$')]],
      category: [[]],
      nameSort: [''],
      priceSort: ['']
    });
  }

  private buildFiltersFromForm(): ProductParams {
    const {
      name,
      brand,
      priceMin,
      priceMax,
      category,
      nameSort,
      priceSort
    } = this.filtersForm.getRawValue() as RefinerFormValue;

    const params: ProductParams = {};

    const trimmedName = this.cleanString(name);
    const trimmedBrand = this.cleanString(brand);

    if (trimmedName) params.name = trimmedName;
    if (trimmedBrand) params.brand = trimmedBrand;
    if (Array.isArray(category) && category.length) {
      params.categories = category.join(',');
    }

    const min = this.toNumber(priceMin);
    const max = this.toNumber(priceMax);

    if (min !== null && max !== null) {
      params.priceBetween = `${Math.min(min, max)},${Math.max(min, max)}`;
    } else if (min !== null) {
      params.priceGreater = min;
    } else if (max !== null) {
      params.priceLess = max;
    }

    const trimmedNameSort = this.cleanString(nameSort);
    const trimmedPriceSort = this.cleanString(priceSort);

    if (trimmedNameSort) {
      params.sort = `name,${trimmedNameSort}`;
    } else if (trimmedPriceSort) {
      params.sort = `price,${trimmedPriceSort}`;
    }

    return params;
  }

  private patchFormWithFilters(filters: ProductParams): void {
    const patchValue: RefinerFormValue = {
      name: filters.name ?? '',
      brand: filters.brand ?? '',
      priceMin: '',
      priceMax: '',
      category: filters.categories ? filters.categories.split(',') : [],
      nameSort: '',
      priceSort: ''
    };

    if (filters.priceBetween) {
      const [min, max] = filters.priceBetween.split(',').map(v => v.trim());
      patchValue.priceMin = min ?? '';
      patchValue.priceMax = max ?? '';
    } else {
      if (filters.priceGreater !== undefined) patchValue.priceMin = `${filters.priceGreater ?? ''}`;
      if (filters.priceLess !== undefined) patchValue.priceMax = `${filters.priceLess ?? ''}`;
    }

    if (filters.sort) {
      const [field, direction] = filters.sort.split(',');
      if (field === 'name') {
        patchValue.nameSort = direction ?? '';
      } else if (field === 'price') {
        patchValue.priceSort = direction ?? '';
      }
    }

    this.filtersForm.patchValue(patchValue, { emitEvent: false });
  }

  private cleanString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  private toNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
