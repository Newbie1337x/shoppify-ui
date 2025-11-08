import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { SwalService } from '../../services/swal-service';
import { CategoryService } from '../../services/category-service';
import { ProductCard } from '../product-card/product-card';
import { Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    ProductCard,
    DecimalPipe
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductForm implements OnInit {
  form!: FormGroup

  @Input() product?: Product
  categories?: Category[]
  

  previewProduct!: Product

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private swal: SwalService,
    private categoryService:CategoryService,
  ) {}

  get controls() {
    return this.form.controls
  }



  @HostListener('window:scroll')
  onScroll() {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      id: [this.product?.id || ''],
      name: [this.product?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: [this.product?.price || '', [Validators.required, Validators.min(0)]],
      unitPrice: [this.product?.unitPrice || '', [Validators.required, Validators.min(0)]],
      discountPercentage: [this.product?.discountPercentage ?? 0, [Validators.min(0), Validators.max(100)]],
      stock: [this.product?.stock || '', [Validators.required, Validators.min(0)]],
      sku: [this.product?.sku || '', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      barcode: [this.product?.barcode || '', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      description: [this.product?.description || '', [Validators.maxLength(500)]],
      brand: [this.product?.brand || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      imgURL: [this.product?.imgURL || ''],
      categories: [this.product?.categories || [], Validators.required],
    })

    if (this.product) {
      this.form.markAllAsDirty()
    } else {
      this.controls['id'].setValue(undefined)
    }



    this.getCategories()
  }

  DynamicDescription(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsDirty()
      return;
    }

    const formValues = this.previewProduct;
    const editMode = !!this.product

    const request = editMode
      ? this.productService.patch(formValues)
      : this.productService.post(formValues)

    request.subscribe({
      next: (productResponse: Product) => {
        this.swal.success(editMode ? "Producto editado con Exito!" : "Producto agregado con Exito!")
          .then(() => {
            if (!editMode) {
              this.form.reset();
            }
          });
      },
      error: (err) => {
        const defaultMessage = editMode ? "Error al editar el producto" : "Error al agregar el producto";
        const errorMessage = err.error?.message || defaultMessage;
        
        this.swal.error(errorMessage)
      }
    });
  }

  getCategories() {
    this.categoryService.getList().subscribe({
      next: (data) => {
        this.categories = data.data
      },
      error(err) {
        console.error(err)
      },
    })
  }
}



