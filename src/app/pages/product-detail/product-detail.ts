import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart-service';
import { ProductCard } from '../../components/product-card/product-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  imports: [ProductCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  
  product!: Product;
  id?: number;
  relatedProducts: Product[] = [];

  constructor(
    private pService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.renderProduct();
    this.loadRelatedProducts();
  }

  renderProduct(){
    this.pService.get(this.id!).subscribe({
      next: prod => {
        this.product = prod
      },
      error:(e) =>{
        console.log(e)
        this.router.navigate(["/"])
      }
    })
  }

  loadRelatedProducts(): void {
    this.pService.getList({ page: 0, size: 8 }).subscribe({
      next: products => {
        //FIX WITH PROPER FILTERS.
      },
      error: (e) => {
        console.error('Error loading related products:', e);
      }
    });
  }

  onAddToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product)
    this.showCartSuccessToast(this.product.name)
  }

  onBuyNow(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
    this.router.navigate(['/cart']);
  }

  showCartSuccessToast = (productName: string) => {
  Swal.fire({

    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    
    timer: 1500,
    timerProgressBar: true,
    
    icon: 'success',
    title: `"${productName}" agregado.`,
    customClass: {
        popup: 'swal2-toast-dark'
    }
  })
  }
}
