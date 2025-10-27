import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoryCard } from '../../components/category-card/category-card';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryCard],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css'
})
export class CategoriesPage implements OnInit {
  categories: Category[] = []
  refinedCategories: Category[] = []

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.renderCategories()
  }

  renderCategories(): void {
    this.categoryService.getList().subscribe({
      next: (categories) => {
        this.categories = categories,
        this.refinedCategories = [...categories]
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un problema al obtener las categorias",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        })
      }
    })
  }

  deleteCategory(id: number): void {
    this.categoryService.delete(id).subscribe({
      next: () => {
        Swal.fire({
          title: "Categoria eliminada con exito!",
          icon: "success",
          confirmButtonText: "Volver",
          confirmButtonColor: "#ff7543"
        })
        this.renderCategories();
      },
      error: (err) => {
        console.error('Error al eliminar la categoria:')
      }
    })
  }

  editCategory(id: number) {
    this.router.navigate([`/categories/edit/${id}`])
  }
}