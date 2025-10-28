import { Component, input, OnInit, output } from '@angular/core';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { debounce, debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-category-refiner',
  imports: [FormsModule],
  templateUrl: './category-refiner.html',
  styleUrl: './category-refiner.css'
})
export class CategoryRefiner implements OnInit{
  categories = input.required<Category[]>()
  outputCategories = output<Category[]>()
  filterChange = new Subject<void>()
  refinedCategories!: Category[]

  nameFilter!: string
  nameSort!: 'asc' | 'desc' | null

  ngOnInit(): void {
    this.refinedCategories = [...this.categories()]
    this.filterChange.pipe(debounceTime(500)).subscribe(() => this.refineCategories())
  }

  onFilterChange() {
    this.filterChange.next()
  }

  filterCategories() {
    this.refinedCategories = [...this.categories()]
    if(this.nameFilter && this.nameFilter.trim() !== "") {
      this.refinedCategories = this.refinedCategories.filter(category => 
        category.name?.trim().toLowerCase().includes(this.nameFilter.trim().toLowerCase())
      );
    }
  }

  sortCategories()  {
    if(this.nameSort) {
      if(this.nameSort === 'desc') {
        this.refinedCategories = this.refinedCategories?.sort((a, b) => b.name.localeCompare(a.name))
      } else {
        this.refinedCategories = this.refinedCategories?.sort((a, b) => a.name.localeCompare(b.name))
      }
    }
  }

  refineCategories() {
    this.filterCategories()
    this.sortCategories()
    this.outputCategories.emit(this.refinedCategories)
  }
}