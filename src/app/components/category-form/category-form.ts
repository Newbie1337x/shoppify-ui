import { Component, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { combineLatest, debounceTime, distinct, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {
  categories = input.required<Category[]>()
  form!: FormGroup
  name!: FormControl
  imgUrl!: FormControl

  id!: string
  repeatedCategory!: Category | undefined
  repeatedFields!: string[] | undefined

  change = output<void>()

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      imgUrl: ['', Validators.maxLength(200)]
    })
    this.name = this.form.controls['name'] as FormControl
    this.imgUrl = this.form.controls['imgUrl'] as FormControl

    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getCategoryByID()
    } else {
      this.form.controls['id'].setValue(undefined)
    }

    combineLatest([
      this.name.valueChanges.pipe(startWith(this.name.value), debounceTime(300), distinctUntilChanged()),
      this.imgUrl.valueChanges.pipe(startWith(this.imgUrl.value), debounceTime(300), distinctUntilChanged())
    ]).pipe(
      map(([name, imgUrl]) => {
        const category = this.categories().find(c =>
          c.id !== Number(this.id) &&
          (c.name?.trim().toLowerCase() === name?.trim().toLowerCase() ||
            c.imgUrl === imgUrl)
        )
        if (!category) return undefined;

        const repeatedFields: string[] = [];
        if (category.name?.trim().toLowerCase() === name?.trim().toLowerCase()) repeatedFields.push('name');
        if (category.imgUrl != undefined && category.imgUrl === imgUrl) repeatedFields.push('img');

        return { category, repeatedFields };
      })
    ).subscribe({
      next: data => {
        this.repeatedCategory = data?.category || undefined,
          this.repeatedFields = data?.repeatedFields || []
      },
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

  getCategoryByID() {
    this.categoryService.get(Number.parseInt(this.id)).subscribe({
      next: data => this.form.patchValue(data),
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener la categoria",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate(['/categories'])
          }
        })
      }
    })
  }

  submitForm() {
    if (this.form.valid && !this.repeatedCategory) {
      if (Number(this.id)) {
        this.categoryService.patch(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Categoria editada con exito!",
              icon: "success",
              confirmButtonText: "Volver",
              confirmButtonColor: "#ff7543"
            }).then((res) => {
              if (res.isConfirmed) {
                this.form.reset()
                this.router.navigate(['/categories'])
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
            })
          }
        })
      } else {
        this.categoryService.post(this.form.value).subscribe({
          next: () => {
            Swal.fire({
              title: "Categoria agregada con exito!",
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
              text: "Ocurrio un problema al cargar la categoria",
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