import { Component, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-products-refiner',
  imports: [
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule, 
    MatButtonModule, 
    MatOptionModule, 
    FormsModule
  ],
  templateUrl: './products-refiner.html',
  styleUrl: './products-refiner.css'
})
export class ProductsRefiner implements OnInit{
  products = input.required<Product[]>()
  categories = input.required<Category[]>()
  outputProducts = output<Product[]>()
  filterChange = new Subject<void>()
  refinedProducts!: Product[]


  nameFilter!: string
  brandFilter!: string
  priceFilter!: number
  categoryFilter!: string[]

  nameSort!: 'asc' | 'desc' | null
  priceSort!: 'asc' | 'desc'| null

  constructor() {}

  ngOnInit(): void {
    this.refinedProducts = [...this.products()]
    this.filterChange.pipe(debounceTime(500)).subscribe(() => {this.refineProducts()})
  }

  onFilterChange() {
    this.filterChange.next()
  }

  filterProducts() {
    this.refinedProducts = [...this.products()]
    if(this.nameFilter && this.nameFilter.trim() !== "") {
      this.refinedProducts = this.refinedProducts.filter(product => 
        product.name?.trim().toLowerCase().includes(this.nameFilter.trim().toLowerCase())
      );
    }

    if(this.brandFilter && this.brandFilter.trim() !== "") {
      this.refinedProducts = this.refinedProducts.filter(product => 
        product.brand?.trim().toLowerCase().includes(this.brandFilter.trim().toLowerCase())
      );
    }

    if(this.priceFilter) {
      if(this.priceFilter === 0) {
        this.refinedProducts = this.refinedProducts.filter(p => p.price === 0);
      } else {
        this.refinedProducts = this.refinedProducts.filter(p => p.price <= this.priceFilter);
      }
    }

    if(this.categoryFilter && this.categoryFilter.length > 0) {
      this.refinedProducts = this.refinedProducts.filter(product => 
        product.categories.map(c => c.trim()).some(c => this.categoryFilter.includes(c))
      );
    }
  }


  sortProducts()  {
    if(this.nameSort) {
      if(this.nameSort === 'desc') {
        this.refinedProducts = this.refinedProducts?.sort((a, b) => b.name.localeCompare(a.name))
      } else {
        this.refinedProducts = this.refinedProducts?.sort((a, b) => a.name.localeCompare(b.name))
      }
    }

    if(this.priceSort) {
      if(this.priceSort === 'desc') {
        this.refinedProducts = this.refinedProducts?.sort((a, b) => b.price - a.price)
      } else {
        this.refinedProducts = this.refinedProducts?.sort((a, b) => a.price - b.price)
      }
    }
  }

  refineProducts() {
    this.filterProducts()
    this.sortProducts()
    this.outputProducts.emit(this.refinedProducts)
  }
}