import { Component, Input } from '@angular/core';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { ImageFallbackDirective } from '../../directives/image-fallback';

@Component({
  selector: 'app-category-card',
  imports: [ImageFallbackDirective],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css'
})
export class CategoryCard {

constructor(private router:Router){}

@Input() category!:Category

getDetails(id: number){
  this.router.navigate(["categories/" + id]);
}
}
