import { Component } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product-page',
  imports: [ProductForm],
  templateUrl: './edit-product-page.html',
  styleUrl: './edit-product-page.css'
})
export class EditProductPage {
  
  constructor(
    private router: Router
  ) {}

  getBack() {
    this.router.navigate(['/products'])
  }
}
