import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../models/category';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'app-category-form-dialog',
  imports: [CategoryForm],
  templateUrl: './category-form-dialog.html',
  styleUrl: './category-form-dialog.css'
})
export class CategoryFormDialog {
  constructor(
    private dialog: MatDialogRef<CategoryFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      category?: Category;
      categories: Category[];
    }
  ) { }

  close(category: Category | void) {
    this.dialog.close(category)
  }
}