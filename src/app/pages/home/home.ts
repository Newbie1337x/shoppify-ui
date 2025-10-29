import { Component, OnInit, Query } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { ProductCard } from "../../components/product-card/product-card";
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';
import { StoreService } from '../../services/store-service';
import { HomeCarousel } from '../../models/homeCarousel';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent } from '@coreui/angular';
import { CategoryCard } from "../../components/category-card/category-card";
import { RouterLink } from '@angular/router';
import { globalParams } from '../../models/filters/globalParams';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    ProductCard,
    CategoryCard,
    RouterLink
],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  products: Product[] = [];
  categories:Category[] = [];
  carouselItems:HomeCarousel[] = [];
  params : globalParams = {
      page:0,
      size:5,
    }
  

  constructor(private productService:ProductService, private categoryService:CategoryService, private storeService:StoreService) {

  }

  ngOnInit(): void {
    this.renderProducts();
    this.renderCategories();
    this.renderStoreCarousel();
  }

  renderProducts(): void {

    
    
    this.productService.getList(this.params).subscribe({
      next: (products) => {
        this.products = products;
        
      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
      }
    });
  }


    renderCategories(): void {
    this.categoryService.getList(this.params).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error al obtener todas las categorias:', err);
      }
    });
  }

  renderStoreCarousel(){
    this.storeService.getCarousel().subscribe({
      next: (value: any) => {
        this.carouselItems = Array.isArray(value) ? value : [value];
      },
      error: (err) => {
        console.error('Error al obtener carousel de tienda:', err);
      }
    });
  }

}
