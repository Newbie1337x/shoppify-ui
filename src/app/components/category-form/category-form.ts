import { Component, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';
import { combineLatest, debounceTime, distinct, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { SwalService } from '../../services/swal-service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {
  form!: FormGroup

  repeatedCategory!: Category | undefined
  repeatedFields!: string[] | undefined

  category =  input<Category>()
  categories = input.required<Category[]>()
  submit = output<Category | void>()

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private swal: SwalService
  ) {}

  get controls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.category()?.id || ''],
      name: [this.category()?.name || '', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(50)]],
      imgUrl: [this.category()?.imgUrl || '', Validators.maxLength(200)]
    })

    if (this.category()) {
      this.form.markAllAsDirty()
    } else {
      this.form.controls['id'].setValue(undefined)
    }

    combineLatest([
      this.controls['name'].valueChanges.pipe(startWith(this.controls['name'].value), debounceTime(300), distinctUntilChanged()),
      this.controls['imgUrl'].valueChanges.pipe(startWith(this.controls['imgUrl'].value), debounceTime(300), distinctUntilChanged())
    ]).pipe(
      map(([name, imgUrl]) => {
        const category = this.categories().find(c =>
          c.id !== this.category()?.id &&
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
       this.swal.error("Ocurrio un problema al obtener las categorias")
       .then((res) => {
          if (res.isConfirmed) {
            this.submit.emit()
          }
        })
      }
    })
  }

  submitForm() {
    if (this.form.invalid || this.repeatedCategory) {
      this.form.markAllAsDirty()
      return;
    }

    const formValues = this.form.value;
    const editMode = !!this.category()

    const request = editMode
      ? this.categoryService.patch(formValues)
      : this.categoryService.post(formValues)

    request.subscribe({
      next: () => {
        this.swal.success(editMode ? "Categoria editada con éxito!" : "Categoria agregada con éxito!")
          .then(() => {
            this.form.reset();
            this.submit.emit(formValues)
          });
      },
      error: () => {
        this.swal.error(editMode ? "Error al editar la categoria" : "Error al agregar la categoria")
          .then(() => this.submit.emit())
      }
    })
  }
}