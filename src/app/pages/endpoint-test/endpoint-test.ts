import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import Swal from 'sweetalert2';
import { ProductCard } from "../../components/product-card/product-card";
import { ProductForm } from '../../components/product-form/product-form';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-endpoint-test',
  imports: [ProductCard, ProductForm],
  templateUrl: './endpoint-test.html',
  styleUrl: './endpoint-test.css'
})
export class EndpointTest implements OnInit {
  products: Product[] = [];
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

      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
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
        alert('Producto borrado exitosamente.');
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