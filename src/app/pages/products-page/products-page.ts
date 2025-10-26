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
    this.renderProducts();
    this.renderCategories();

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

  refineProducts() {
    return 
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

  renderError(err: string) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err,

    });
  }

  renderOk(okMsg: string) {
    Swal.fire({
      title: "Operacion realizada!",
      text: okMsg,
      icon: "success"
    });
  }

  editProduct(id: number) {
    this.router.navigate([`/products/edit/${id}`])
  }
}
