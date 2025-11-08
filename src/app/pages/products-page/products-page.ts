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
import { SwalService } from '../../services/swal-service';
import { ProductTable } from '../../components/product-table/product-table';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialog } from '../../components/product-form-dialog/product-form-dialog';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/hal/page';
import { PaginationModule } from '@coreui/angular';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    ProductCard,
    ProductsRefiner,
    ProductTable,
    CommonModule,
    PaginationModule
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage {
  //Paginacion
  productsPage!: Page
  defaultSize:number = 9
  //Arreglos
  refinedProducts: Product[] = [];
  categories: Category[] = [];
  //Filtros
  currentFilters: ProductParams = { page: 0, size: this.defaultSize};
  //Toggles
  editMode = false;
  adminView = false;
 

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public auth: AuthService,
    private swal: SwalService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filters = this.parseFilters(params);
      this.currentFilters = filters;

      this.renderRefinedProducts(filters);
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
    const merged: ProductParams = { page: 0, size: this.defaultSize, ...filters };
    this.currentFilters = merged;
    this.navigateWithFilters(merged);
  }

  renderRefinedProducts(filters: ProductParams): void {
    this.productService.getList(filters).subscribe({
      next: (data) => {
        this.refinedProducts = data.data;
        this.productsPage = data.page; 
      },
      error: (err) => {
        this.swal.error("Ocurrio un error al filtrar los productos")
      }
    });
  }

  renderCategories(): void {
    this.categoryService.getList().subscribe({
      next: (data) => {
        this.categories = data.data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías:', err);
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        this.swal.success('Producto eliminado con éxito!')
        this.renderRefinedProducts(this.currentFilters); 
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      }
    });
  }

  onDelete() {
    this.renderRefinedProducts(this.currentFilters);
  }

  editProduct(product: Product): void {
    this.dialog.open(ProductFormDialog, {
      maxWidth: "none",
      width: '80vw',
      data: {
        product: product,
        products: this.refinedProducts, 
        categories: this.categories
      },
      disableClose: true,
      panelClass: 'product-dialog-panel'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.swal.success("El producto se edito correctamente!")
        this.renderRefinedProducts(this.currentFilters); 
      }
    })
  }


  private navigateWithFilters(filters: ProductParams): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.cleanParams(filters)
    });
  }


  createProduct() {
    this.dialog.open(ProductFormDialog, {
      maxWidth: "none",
      width: '80vw',
      data: {
        products: this.refinedProducts,
        categories: this.categories
      },
      disableClose: true,
      panelClass: 'product-dialog-panel'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.swal.success("El producto se agrego correctamente!")
        this.renderRefinedProducts(this.currentFilters);
      }
    })
  }

  private parseFilters(params: Params): ProductParams {
    const filters: ProductParams = {
      page: params['page'] ? Number(params['page']) : 0,
      size: params['size'] ? Number(params['size']) : this.defaultSize
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


 nextPage(){
    if (this.productsPage && this.productsPage.number < (this.productsPage.totalPages - 1)) {
      
      this.currentFilters.page = this.productsPage.number + 1;
      this.navigateWithFilters(this.currentFilters);
    }
  }

  prevPage(){
    if (this.productsPage && this.productsPage.number > 0) {
      
      this.currentFilters.page = this.productsPage.number - 1;
      this.navigateWithFilters(this.currentFilters);
    }
  }

  goToPage(page: number){
    this.currentFilters.page = page
    this.navigateWithFilters(this.currentFilters)
  }


  get pagesArray(): number[] {
    if (!this.productsPage) {
      return [];
    }
    return Array(this.productsPage.totalPages).fill(0).map((x,i) => i);
  }

  get totalResults():number{
  if(!this.productsPage){
    return 0
  }
  return this.productsPage.totalElements;
  }
}
