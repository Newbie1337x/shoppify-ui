import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';
import { ProductsPage } from './pages/products-page/products-page';

export const routes: Routes = [

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ]
  },

  {
    path: '',
    component: Main,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'search/:q', component: SearchResults },
      { path: 'categories/:id', component: SearchResults },
      { path: 'products', component: ProductsPage},
      { path: 'products/edit/:id', component: EditProductPage}
    ]
  },
];