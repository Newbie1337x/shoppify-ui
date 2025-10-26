import { Component, Input } from '@angular/core';
import { Category } from '../../models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [],
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
