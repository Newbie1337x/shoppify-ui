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
import { ProductForm } from './components/product-form/product-form';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { EditCategoryPage } from './pages/edit-category-page/edit-category-page';
import { CategoriesPage } from './pages/categories-page/categories-page';


export const routes: Routes = [
  
  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: 'admin', component: AdminPage },
      { path: 'register', component: Register },
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
      { path:'categories', component: CategoriesPage},
      { path:'categories/edit/:id', component: EditCategoryPage},
      { path: 'profile', component: Profile },
      { path: 'cart', component: CartPage},
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
  

    ]
  },
];