import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  
  
  product!: Product;
  id?: number;

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


  onAddToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
  }

  onBuyNow(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
    this.router.navigate(['/cart']);
  }
}
