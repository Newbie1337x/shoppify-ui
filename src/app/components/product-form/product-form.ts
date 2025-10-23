import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit{
  form!: FormGroup
  sku!: FormControl 

  id!: string
  products!: Product[]
  repeatedProduct!: Product | undefined

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts()
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
    this.sku = this.form.controls['sku'] as FormControl

    this.id = this.route.snapshot.params['id']
    if(this.id) {
      this.getProductByID()
    } else {
      this.form.controls['id'].setValue(undefined)
    }

    this.sku.valueChanges.subscribe(() =>
      this.repeatedProduct = this.products.find(p => 
        p.id !== Number(this.id) &&
        p.sku?.trim().toLowerCase() === this.sku.value?.trim().toLowerCase()
      )
    )
  }

  getProducts() {
    this.productService.getList().subscribe({
      next: data => {this.products = data},
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener los productos",
          confirmButtonText: "Volver"
        })
      }
    })
  }

  getProductByID() {
    this.productService.get(Number.parseInt(this.id)).subscribe({
      next: data => this.form.patchValue(data),
      error: () =>  {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener el producto",
          confirmButtonText: "Volver"
        }).then((res) => {
          if(res.isConfirmed) {
            this.router.navigate([''])
          }
        })
      }
    })
  }

  submitForm() {
    if(this.form.valid && !this.repeatedProduct) {
      if(Number(this.id)) {
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
    }else {
      this.form.markAllAsTouched()
    }
  }
}