import { Routes } from '@angular/router';
import { SearchResults } from './pages/search-results/search-results';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { EndpointTest } from './pages/endpoint-test/endpoint-test';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';
import { Profile } from './pages/profile/profile';
import { CartPage } from './pages/cart-page/cart-page';


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
      { path: 'products', component: EndpointTest},
      { path: 'products/edit/:id', component: EditProductPage},
      { path: 'profile', component: Profile},
      { path: 'cart', component: CartPage}
    ]
  },
];