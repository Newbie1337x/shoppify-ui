import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

import { Category } from '../../models/category';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { ImageFallbackDirective } from '../../directives/image-fallback';
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
    ImageFallbackDirective,
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
    private categoryService: CategoryService,
    private router: Router,
   
  ) {}

  get controls() {
    return this.form.controls
  }

  private updatePreview(): void {
    if (!this.form) {

      this.previewProduct = {
        id: this.product?.id ?? 0,
        name: this.product?.name ?? 'Producto sin nombre',
        price: this.product?.price ?? 0,
        unitPrice: this.product?.unitPrice ?? this.product?.price ?? 0,
        stock: this.product?.stock ?? 0,
        sku: this.product?.sku ?? '',
        barcode: this.product?.barcode ?? '',
        description: this.product?.description ?? '',
        brand: this.product?.brand ?? '',
        discountPercentage: this.product?.discountPercentage ?? 0,
        priceWithDiscount: this.product?.priceWithDiscount ?? this.product?.price ?? 0,
        imgURL: this.product?.imgURL ?? '',
        soldQuantity: this.product?.soldQuantity ?? 0,
        categories: this.product?.categories ?? [],
        _links: this.product?._links
      };
      return;
    }


    const values = this.form.value;
    this.previewProduct = {
      id: Number(values['id'] ?? this.product?.id ?? 0),
      name: values['name'] || 'Producto sin nombre',
      price: (values['price']),
      unitPrice: values['unitPrice'] ?? values['price'],
      stock: values['stock'],
      sku: values['sku'] || '',
      barcode: values['barcode'] || '',
      description: values['description'] || '',
      discountPercentage: values['discountPercentage'] ?? 0,
      priceWithDiscount: this.getDiscountedPrice(values['price'], values['discountPercentage']),
      brand: values['brand'] || '',
      imgURL: values['imgURL'] || '',
      soldQuantity: this.product?.soldQuantity ?? 0,
      categories: Array.isArray(values['categories']) ? values['categories'] : [],
      _links: this.product?._links
    };
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

    // CAMBIO: Establecemos el estado inicial del preview
    this.updatePreview();

    // CAMBIO: Nos suscribimos a los cambios del formulario
    this.form.valueChanges.subscribe(() => {
      // Cada vez que el formulario cambia, actualizamos nuestro objeto 'previewProduct'
      this.updatePreview();
    });

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

    // Usamos el snapshot más reciente del preview, que está sincronizado
    const formValues = this.previewProduct;
    const editMode = !!this.product

    const request = editMode
      ? this.productService.patch(formValues)
      : this.productService.post(formValues)

    request.subscribe({
      next: () => {
        this.swal.success(editMode ? "Producto editado con éxito!" : "Producto agregado con éxito!")
          .then(() => {
            this.form.reset();
          });
      },
      error: (err) => {
        const defaultMessage = editMode ? "Error al editar el producto" : "Error al agregar el producto";
        const errorMessage = err.error?.message || defaultMessage;
        
        this.swal.error(errorMessage)
      }
    });
  }

  private getDiscountedPrice(priceValue: unknown, discountValue: unknown): number {
    const price = Number(priceValue ?? 0);
    const discount = Number(discountValue ?? 0);

    if (!isFinite(price) || price <= 0) {
      return price > 0 ? price : 0;
    }

    // CAMBIO: Modifiqué tu lógica. El descuento debe ser en DECIMAL (0.15)
    // Pero tu form lo maneja como 15 (max 100). Así que lo dividimos por 100.
    const discountDecimal = discount / 100;

    if (!isFinite(discountDecimal) || discountDecimal <= 0) {
      return price;
    }

    // Aplicamos el descuento
    const discounted = price - (price * discountDecimal);
    return discounted > 0 ? discounted : 0;
  }

  // CAMBIO: Estos getters ya no son necesarios.
  // get previewPriceWithDiscount(): number { ... }
  // get previewSavings(): number { ... }


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