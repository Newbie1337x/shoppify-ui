import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';

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
}
