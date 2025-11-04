import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { CartPage } from './pages/cart-page/cart-page';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductDetail } from './pages/product-detail/product-detail';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { Help } from './pages/help/help';
import { ConfigPages } from './layouts/config-pages/config-pages';


export const routes: Routes = [

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login, canActivate: [publicGuard] },
      { path: 'register', component: Register, canActivate: [publicGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ]
  },

  {
    path: '',
    component: Main,
    children: [
      { path: 'home', component:Home},
      { path: 'products', component: ProductsPage},
      { path: 'products/search/:q', component: ProductsPage},
      { path: 'cart', component: CartPage, canActivate: [authGuard] },
    ]
  },

  {
    path: '',
    component: ConfigPages,
    children: [
      { path: 'profile', component: Profile, canActivate: [authGuard] },
      { path: 'help', component: Help},
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  
];