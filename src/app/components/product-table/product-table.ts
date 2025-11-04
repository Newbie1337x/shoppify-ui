import { Component, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../services/swal-service';
import { TableDirective } from "@coreui/angular";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [CommonModule],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css'
})
export class ProductTable{
  isEditMode = input<boolean>(false)
  products = input<Product[]>()
  deleteEvent = output<void>()
  editEvent = output<Product>()

  constructor(
    private productService: ProductService,
    private swal: SwalService,
  ) {}

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        this.swal.success("Producto eliminado con exito!")
        this.deleteEvent.emit()
      },
      error: (err) => {
        this.swal.error("Ocurrio un error al eliminar el producto")
      }
    });
  }

  editProduct(product: Product) {
    this.editEvent.emit(product)
  }
}