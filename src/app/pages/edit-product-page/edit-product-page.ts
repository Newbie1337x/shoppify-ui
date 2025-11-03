import { Component, OnInit } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product-page',
  imports: [ProductForm],
  templateUrl: './edit-product-page.html',
  styleUrl: './edit-product-page.css'
})
export class EditProductPage implements OnInit {
  products: Product[] = []

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products.data;
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener los productos",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        })
      }
    });
  }

  getBack() {
    this.router.navigate(['/products'])
  }
}