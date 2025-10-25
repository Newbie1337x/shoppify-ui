import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { EndpointTest } from './pages/endpoint-test/endpoint-test';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';

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
      { path: 'search/:q', component: SearchResults },
      { path: 'categories/:id', component: SearchResults },
      { path: 'products/:id', component: SearchResults },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {path: 'products', component: EndpointTest},
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'search/:q', component: SearchResults},
  {path: 'categories/:id', component:SearchResults},
  {path: 'products/:id', component:SearchResults},
  {path: 'products/edit/:id', component: EditProductPage}
];