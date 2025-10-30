import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductParams } from '../../models/filters/productParams';

@Component({
  selector: 'app-product-table',
  imports: [],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css'
})
export class ProductTable implements OnInit{
  products: Product[] = []
  refinedProducts: Product[] = []
  categories: Category[] = []

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private 
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params)) {
        this.renderProducts()
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
      },
      error: () => {
        
      }
    });
  }

  renderRefinedProducts(filters: ProductParams) {
    this.productService.getList(filters).subscribe({
      next: (data) => {
        this.refinedProducts = data;
      },
      error: (err) => {
        
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
