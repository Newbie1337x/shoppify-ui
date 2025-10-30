import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import {Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

@Input() product!: Product
@Input() isMostrarStock: boolean = false
@Input() isMostrarCuotas: boolean = false

constructor(private router:Router){}

getDetails(id: number){
  this.router.navigate(["/products/detail", id]);
}
}
