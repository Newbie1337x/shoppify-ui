import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart-service';
import { ProductCard } from '../../components/product-card/product-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  imports: [ProductCard, DecimalPipe],
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
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        const parsedId = idParam ? Number(idParam) : NaN;

        if (!idParam || Number.isNaN(parsedId)) {
          this.router.navigate(['/']);
          return;
        }

        this.id = parsedId;
        this.renderProduct(parsedId);
        this.loadRelatedProducts();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  renderProduct(id: number){
    this.pService.get(id).subscribe({
      next: prod => {
        this.product = prod;
      },
      error:(e) =>{
        console.log(e);
        this.router.navigate(['/']);
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
