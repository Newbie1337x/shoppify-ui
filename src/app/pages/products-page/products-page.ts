import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsRefiner } from '../../components/product-refiner/product-refiner';
import { ProductParams } from '../../models/filters/productParams';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-products-page',
  imports: [
    ProductCard,
    ProductsRefiner,
    
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage {
  products: Product[] = [];
  refinedProducts: Product[] = [];
  categories: Category[] = [];
  currentFilters: ProductParams = { page: 0, size: 6 };
  editMode = false;
  adminView = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filters = this.parseFilters(params);
      this.currentFilters = filters;

      if (this.hasFilterCriteria(filters)) {
        this.renderRefinedProducts(filters);
      } else {
        this.renderProducts();
      }

      this.renderCategories();
    });
  }

  editToggle(): void {
    this.editMode = !this.editMode;
  }

  viewToggle(): void {
    this.adminView = !this.adminView;
  }

  onFilterChange(filters: ProductParams): void {
    const merged: ProductParams = { page: 0, size: 6, ...filters };
    this.currentFilters = merged;
    this.navigateWithFilters(merged);
  }

  renderProducts(): void {
    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products;
        this.refinedProducts = [...products];
      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
      }
    });
  }

  renderRefinedProducts(filters: ProductParams): void {
    this.productService.getList(filters).subscribe({
      next: (data) => {
        this.refinedProducts = data;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un problema al obtener los productos',
          confirmButtonText: 'Volver',
          confirmButtonColor: '#4338ca'
        });
      }
    });
  }

  renderCategories(): void {
    this.categoryService.getList().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al obtener todos los productos:', err);
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Producto eliminado con éxito!',
          icon: 'success',
          confirmButtonText: 'Volver',
          confirmButtonColor: '#ff7543'
        });
        this.renderProducts();
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      }
    });
  }

  editProduct(id: number): void {
    this.router.navigate([`/products/edit/${id}`]);
  }


  private navigateWithFilters(filters: ProductParams): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.cleanParams(filters)
    });
  }


  createProduct(){
    this.router.navigate(['/products/create']);
  }

  private parseFilters(params: Params): ProductParams {
    const filters: ProductParams = {
      page: params['page'] ? Number(params['page']) : 0,
      size: params['size'] ? Number(params['size']) : 6
    };

    if (params['name']) filters.name = params['name'];
    if (params['brand']) filters.brand = params['brand'];
    if (params['categories']) filters.categories = params['categories'];
    if (params['priceBetween']) filters.priceBetween = params['priceBetween'];
    if (params['priceGreater']) filters.priceGreater = Number(params['priceGreater']);
    if (params['priceLess']) filters.priceLess = Number(params['priceLess']);
    if (params['sort']) filters.sort = params['sort'];

    return filters;
  }

  private cleanParams(filters: ProductParams): Params {
    const query: Params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value;
      }
    });

    return query;
  }

  private hasFilterCriteria(filters: ProductParams): boolean {
    const { page, size, ...rest } = filters;
    return Object.keys(rest).length > 0;
  }
}
