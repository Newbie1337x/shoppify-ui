import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category-page',
  imports: [],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.css'
})
export class EditCategoryPage {

  constructor(private router: Router) {}

  getBack() {
    this.router.navigate(['/categories'])
  }
}