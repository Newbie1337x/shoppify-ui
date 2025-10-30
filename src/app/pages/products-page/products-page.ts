import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductsRefiner } from '../../components/products-refiner/products-refiner';
import { ProductParams } from '../../models/filters/productParams';
import { ProductTable } from '../../components/product-table/product-table';

@Component({
  selector: 'app-products-page',
  imports: [
    ProductForm,
    ProductsRefiner,
    ProductTable
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage {
  products: Product[] = [];
  categories: Category[] = [];

  constructor(private router: Router) {}
  
  renderPage() {
    this.router.navigate(['/products'])
  }
}