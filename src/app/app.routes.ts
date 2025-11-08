import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { CartPage } from './pages/cart-page/cart-page';
import { ProductsPage } from './pages/products-page/products-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { authGuard } from './core/guards/auth-guard';
import { Help } from './pages/help/help';
import { publicGuard } from './core/guards/public-guard';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Purchases } from './pages/purchases/purchases';
import { Terms } from './pages/terms/terms';
import { ConfigPages } from './layouts/config-pages/config-pages';
import { Privacy } from './pages/privacy/privacy';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login, canActivate: [publicGuard] },
      { path: 'register', component: Register, canActivate: [publicGuard] },
      { path: 'admin', component: AdminPage },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: Main,
    children: [
      { path: 'home', component: Home },
      { path: 'products', component: ProductsPage },
      { path: 'products/details/:id', component: ProductDetail },
      { path: 'products/search/:q', component: ProductsPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'cart', component: CartPage, canActivate: [authGuard] },
      { path: 'purchases', component: Purchases, canActivate: [authGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'profile',
    component: ConfigPages,
    canActivate: [authGuard],
    children: [{ path: '', component: Profile }]
  },
  {
    path: 'help',
    component: ConfigPages,
    children: [
      { path: '', component: Help },
      { path: 'terms', component: Terms },
      { path: 'privacy', component: Privacy},
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
