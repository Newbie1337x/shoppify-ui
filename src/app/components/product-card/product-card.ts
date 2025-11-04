import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { ImageFallbackDirective } from '../../directives/image-fallback';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, ImageFallbackDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

@Input() product!: Product
@Input() isMostrarStock: boolean = false
@Input() isMostrarCuotas: boolean = false
constructor(private router:Router){}

getDetails(id: number){
  this.router.navigate(["/products/details", id]);
}
}
