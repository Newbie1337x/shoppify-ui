import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductsRefiner } from '../../components/products-refiner/products-refiner';
import { ProductParams } from '../../models/filters/productParams';
import { ProductTable } from '../../components/product-table/product-table';
import { SwalService } from '../../services/swal-service';

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
export class ProductsPage implements OnInit {
  products: Product[] = []
  refinedProducts: Product[] = []
  categories: Category[] = []
  params!: ProductParams

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private swal: SwalService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params)) {
        this.params = params
        this.renderProducts()
        this.renderRefinedProducts(params);
      } else {
        this.renderProducts();
      }
      this.renderCategories()
    });
  }
  
  renderProducts(): void {
    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: () => {
        this.swal.error("Ocurrio un error al buscar los productos")
      }
    });
  }

  renderRefinedProducts(filters: ProductParams) {
    this.productService.getList(filters).subscribe({
      next: (data) => {
        this.refinedProducts = data;
      },
      error: (err) => {
        this.swal.error("Ocurrio un error al filtrar los productos")
      }
    });
  }

  renderCategories(): void {
    this.categoryService.getList().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
      }
    });
  }

  onDelete() {
    if(this.params) {
      this.renderRefinedProducts(this.params)
    } else {
      this.renderProducts()
    }
  }
}