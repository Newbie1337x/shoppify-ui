import { Component, HostListener, Inject, input, OnInit, output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

import { Category } from '../../models/category';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { ImageFallbackDirective } from '../../directives/image-fallback';
import { SwalService } from '../../services/swal-service';

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
    ImageFallbackDirective
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductForm implements OnInit {
  form!: FormGroup

  repeatedProduct!: Product | undefined
  repeatedFields!: string[] | undefined
  
  product = input<Product>()
  products = input.required<Product[]>()
  categories = input<Category[]>()

  submit = output<Product | void>()

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private swal: SwalService,
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
      id: [this.product()?.id || ''],
      name: [this.product()?.name || '', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      price: [this.product()?.price || '', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      unitPrice: [this.product()?.unitPrice || '', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      stock: [this.product()?.stock || '', [Validators.required, Validators.min(0), Validators.max(100000)]],
      sku: [this.product()?.sku || '', [Validators.required, Validators.pattern(/\S/), Validators.minLength(6), Validators.maxLength(12)]],
      barcode: [this.product()?.barcode || '', [Validators.required, Validators.pattern(/\S/), Validators.minLength(12), Validators.maxLength(12)]],
      description: [this.product()?.description || '', [Validators.maxLength(500)]],
      brand: [this.product()?.brand || '', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      imgURL: [this.product()?.imgURL || ''],
      categories: [this.product()?.categories || [], Validators.required],
    })

    if (this.product()) {
      this.form.markAllAsDirty()
    } else {
      this.controls['id'].setValue(undefined)
    }

    combineLatest([
      this.controls['sku'].valueChanges.pipe(startWith(this.controls['sku'].value), debounceTime(300), distinctUntilChanged()),
      this.controls['barcode'].valueChanges.pipe(startWith(this.controls['barcode'].value), debounceTime(300), distinctUntilChanged())
    ]).pipe(
      map(([sku, barcode]) => {
        const product = this.products().find(p =>
          p.id !== this.product()?.id &&
          (p.sku?.trim().toLowerCase() === sku?.trim().toLowerCase() ||
            p.barcode?.trim().toLowerCase() === barcode?.trim().toLowerCase())
        )
        if (!product) return undefined;

        const repeatedFields: string[] = [];
        if (product.sku?.trim().toLowerCase() === sku?.trim().toLowerCase()) repeatedFields.push('sku');
        if (product.barcode?.trim().toLowerCase() === barcode?.trim().toLowerCase()) repeatedFields.push('barcode');

        return { product, repeatedFields };
      })
    ).subscribe({
      next: data => {
        this.repeatedProduct = data?.product || undefined,
          this.repeatedFields = data?.repeatedFields || []
      },
      error: () => {
        this.swal.error("Ocurrio un problema al obtener los productos")
          .then((res) => {
            if (res.isConfirmed) {
              this.submit.emit()
            }
          })
      }
    })
  }

  DynamicDescription(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  submitForm() {
    if (this.form.invalid || this.repeatedProduct) {
      this.form.markAllAsDirty()
      return;
    }

    const formValues = this.form.value;
    const editMode = !!this.product()

    const request = editMode
      ? this.productService.patch(formValues)
      : this.productService.post(formValues)

    request.subscribe({
      next: () => {
        this.swal.success(editMode ? "Producto editado con éxito!" : "Producto agregado con éxito!")
          .then(() => {
            this.form.reset();
            this.submit.emit(formValues)
          });
      },
      error: () => {
        this.swal.error(editMode ? "Error al editar el producto" : "Error al agregar el producto")
          .then(() => this.submit.emit())
      }
    });
  }
}