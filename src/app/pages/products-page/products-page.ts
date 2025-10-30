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

@Component({
  selector: 'app-products-page',
  imports: [
    ProductCard,
    ProductForm,
    ProductsRefiner
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage {
  products: Product[] = [];
  refinedProducts: Product[] = []
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length) {
        this.refinedProducts = [];
        this.products = [];
        this.renderRefinedProducts(params);
      } else {
        this.renderProducts();
      }
      this.renderCategories();
    });
  }

  renderProducts(): void {
    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products;
        this.refinedProducts = [...products]
      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
      }
    });
  }

  renderRefinedProducts(filters: ProductParams) {
    this.productService.getList(filters).subscribe({
      next: (data) => {
        console.log(data)
        this.refinedProducts = data;
      },
      error: (err) => {
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

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        Swal.fire({
          title: "Producto eliminado con exito!",
          icon: "success",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        })
        this.renderProducts();
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      }
    });
  }

  editProduct(id: number) {
    this.router.navigate([`/products/edit/${id}`])
  }
}
