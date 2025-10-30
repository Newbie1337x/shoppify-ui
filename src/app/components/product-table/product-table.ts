import { Component, OnInit, output } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductParams } from '../../models/filters/productParams';
import { SwalService } from '../../services/swal-service';

@Component({
  selector: 'app-product-table',
  imports: [],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css'
})
export class ProductTable implements OnInit{
  products: Product[] = []
  refinedProducts: Product[] = []
  output = output<Product[]>()
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
    });
  }

  renderProducts(): void {
    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products;
        this.output.emit(this.products)
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
        this.output.emit(this.refinedProducts)
      },
      error: (err) => {
        this.swal.error("Ocurrio un error al filtrar los productos")
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        this.swal.success("Producto eliminado con exito!")
        this.renderRefinedProducts(this.params);
      },
      error: (err) => {
        this.swal.error("Ocurrio un error al eliminar el producto")
      }
    });
  }

  editProduct(id: number) {
    this.router.navigate([`/products/edit/${id}`])
  }
}