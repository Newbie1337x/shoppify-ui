import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-endpoint-test',
  imports: [],
  templateUrl: './endpoint-test.html',
  styleUrl: './endpoint-test.css'
})
export class EndpointTest implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProducts();
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

  deleteProducto(id: number): void {
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

editProducto(id: number) {
   const pr: Product = {
    id,
    name: 'Mouse Inalámbrico',
    price: 59.99,
    unitPrice: 15.0,
    stock: 120,
    sku: 'WM-1212345',
    barcode: '01234asdasd567890122',
    description: 'Mouse ergonómico inalámbrico con receptor USB',
    brand: 'Logitech',
    categories: [],
    providers: [],
    imageUrl: ""
  };

  this.productService.put(pr).subscribe({
    next: (response) => {
      console.log('Producto actualizado correctamente:', response);

    },
    error: (err) => {
      console.error('Error al actualizar el producto:', err);
    },
    complete: () => {
      console.log('Edición finalizada');
    }
  });
}

}