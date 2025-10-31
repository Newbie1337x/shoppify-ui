import { Component, HostListener, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category-service';

import { Category } from '../../models/category';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatOptionModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  form!: FormGroup
  name!: FormControl
  price!: FormControl
  unitPrice!: FormControl
  stock!: FormControl
  sku!: FormControl
  barcode!: FormControl
  description!: FormControl
  brand!: FormControl
  categoryControl!: FormControl

  id!: string
  repeatedProduct!: Product | undefined
  repeatedFields!: string[] | undefined

  products = input.required<Product[]>()
  categories!: Category[]

  change = output<void>()

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  @HostListener('window:scroll')
  onScroll() {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
  }

  ngOnInit(): void {
    this.getCategories()
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      unitPrice: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      sku: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(6), Validators.maxLength(12)]],
      barcode: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(12), Validators.maxLength(12)]],
      description: ['', [Validators.maxLength(500)]],
      brand: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      imgURL: [''],
      categories: [[], Validators.required],
    })
    this.name = this.form.controls['name'] as FormControl
    this.price = this.form.controls['price'] as FormControl
    this.unitPrice = this.form.controls['unitPrice'] as FormControl
    this.stock = this.form.controls['stock'] as FormControl
    this.sku = this.form.controls['sku'] as FormControl
    this.barcode = this.form.controls['barcode'] as FormControl
    this.description = this.form.controls['description'] as FormControl
    this.brand = this.form.controls['brand'] as FormControl
    this.categoryControl = this.form.controls['categories'] as FormControl

    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getProductByID()
    } else {
      this.form.controls['id'].setValue(undefined)
    }

    combineLatest([
      this.sku.valueChanges.pipe(startWith(this.sku.value), debounceTime(300), distinctUntilChanged()),
      this.barcode.valueChanges.pipe(startWith(this.barcode.value), debounceTime(300), distinctUntilChanged())
    ]).pipe(
      map(([sku, barcode]) => {
        const product = this.products().find(p =>
          p.id !== Number(this.id) &&
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
        this.repeatedFields = data?.repeatedFields || []},
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener los productos",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([''])
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

  getProductByID() {
    this.productService.get(Number.parseInt(this.id)).subscribe({
      next: data => this.form.patchValue(data), 
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener el producto",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([''])
          }
        })
      }
    })
  }

  getCategories() {
    this.categoryService.getList().subscribe({
      next: data => { this.categories = data },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener las categorias",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([''])
          }
        })
      }
    })
  }

  
  submitForm() {
    if (this.form.valid && !this.repeatedProduct) {
      if (Number(this.id)) {
        this.productService.patch(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Producto editado con exito!",
              icon: "success",
              confirmButtonText: "Volver",
              confirmButtonColor: "#ff7543"
            }).then((res) => {
              if(res.isConfirmed) {
                this.form.reset()
                this.router.navigate(['/products'])
              }
            })
          },
          error: () => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrio un problema al editar el producto",
              confirmButtonText: "Volver",
              confirmButtonColor: "#ff7543"
            }).then((res) => {
              if(res.isConfirmed) {
                this.router.navigate(['/products'])
              }
            })
          }
        })
      } else {
        this.productService.post(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Producto agregado con exito!",
              icon: "success",
              confirmButtonText: "Volver",
              confirmButtonColor: "#ff7543"
            }).then((res) => {
              if (res.isConfirmed) {
                this.form.reset()
                this.change.emit()
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            })
          },
          error: () => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrio un problema al cargar el producto",
              confirmButtonText: "Volver",
              confirmButtonColor: "#ff7543"
            })
          }
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }
}