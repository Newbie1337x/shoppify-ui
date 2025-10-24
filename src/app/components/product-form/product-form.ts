import { Component, OnInit, Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category-service';
import { ProviderService } from '../../services/provider-service';
import { Category } from '../../models/category';
import { combineLatest, filter, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
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
  products!: Product[]
  repeatedProduct!: Product | undefined

  categories!: Category[]
  providers!: Provider[]

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      unitPrice: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      sku: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(6), Validators.maxLength(12)]],
      barcode: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      description: ['', [Validators.maxLength(500)]],
      brand: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      imgURL: [''],
      categories: this.fb.array([], Validators.required),
      providers: this.fb.array([], Validators.required)
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
      this.sku.valueChanges.pipe(startWith(this.sku.value))
    ]).pipe(
        filter(([products]) => !!products), 
        map(([products, sku]) => products.find(p =>
          p.id !== Number(this.id) &&
          p.sku?.trim().toLowerCase() === sku?.trim().toLowerCase()
        ))
      )
      .subscribe(repeated => this.repeatedProduct = repeated)
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