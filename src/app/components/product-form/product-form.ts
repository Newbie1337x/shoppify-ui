import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category-service';
import { ProviderService } from '../../services/provider-service';
import { Category } from '../../models/category';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { Provider } from '../../models/provider';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatOptionModule],
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

  id!: string
  repeatedProduct!: Product | undefined

  categories!: Category[]
  providers!: Provider[]

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
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
    this.getProviders()
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
      providers: [[], Validators.required]
    })
    this.name = this.form.controls['name'] as FormControl
    this.price = this.form.controls['price'] as FormControl
    this.unitPrice = this.form.controls['unitPrice'] as FormControl
    this.stock = this.form.controls['stock'] as FormControl
    this.sku = this.form.controls['sku'] as FormControl
    this.barcode = this.form.controls['barcode'] as FormControl
    this.description = this.form.controls['description'] as FormControl
    this.brand = this.form.controls['brand'] as FormControl

    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getProductByID()
    } else {
      this.form.controls['id'].setValue(undefined)
    }

    combineLatest([
      this.productService.getList(),
      this.sku.valueChanges.pipe(startWith(this.sku.value), debounceTime(300), distinctUntilChanged())
    ]).pipe(
      filter(([products]) => !!products),
      map(([products, sku]) => products.find(p =>
        p.id !== Number(this.id) &&
        p.sku?.trim().toLowerCase() === sku?.trim().toLowerCase()
      ))
    ).subscribe({
      next: data => this.repeatedProduct = data,
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener los productos",
          confirmButtonText: "Volver"
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
          confirmButtonText: "Volver"
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
          confirmButtonText: "Volver"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([''])
          }
        })
      }
    })
  }

  getProviders() {
    this.providerService.getList().subscribe({
      next: data => { this.providers = data },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener las categorias",
          confirmButtonText: "Volver"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([''])
          }
        })
      }
    })
  }

  submitForm() {
    console.log(this.form.valid)
    if (this.form.valid && !this.repeatedProduct) {
      if (Number(this.id)) {
        this.productService.patch(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Producto editado con exito!",
              icon: "success",
              confirmButtonText: "Volver"
            })
          },
          error: () => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrio un problema al editar el producto",
              confirmButtonText: "Volver"
            })
          }
        })
      } else {
        this.productService.post(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Producto agregado con exito!",
              icon: "success",
              confirmButtonText: "Volver"
            })
          },
          error: () => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrio un problema al cargar el producto",
              confirmButtonText: "Volver"
            })
          }
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }
}