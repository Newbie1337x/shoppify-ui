import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import Swal from 'sweetalert2';


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

  renderError(err:string){
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: err,

});
  }

  renderOk(okMsg:string){
    Swal.fire({
  title: "Operacion realizada!",
  text: okMsg,
  icon: "success"
});
  }

editProducto(id: number) {
   const pr: Product = {
    id,
    name: 'Mousea Inalámbrico',
    price: 59.99,
    unitPrice: 15.0,
    stock: 120,
    sku: 'WM-121222345',
    barcode: '0123422a2asdasd567890122',
    description: 'Mouse ergonómico inalámbrico con receptor USB',
    brand: 'Logitech',
    categories: [],
    providers: [],
    imageUrl: ""
  };

  this.productService.put(pr).subscribe({
    next: (response) => {
      this.renderOk("Producto actualizado correctamente.")
      this.renderProducts()

    },
    error: (err) => {
      this.renderError(err.error.message)
    },
    complete: () => {
      console.log('Edición finalizada');
    }
  });
}

}