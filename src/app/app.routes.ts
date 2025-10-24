import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { Login } from './pages/login/login';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';

export const routes: Routes = [
  
    {
        path: 'auth',
        component: Auth,
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
      },

    {
        path: '',
        component: Main,
        children: [
          { path: 'search/:q', component: SearchResults },
       {path: 'categories/:id', component:SearchResults},
       {path: 'products/:id', component:SearchResults},
        {path: 'login', component:Login},
          { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
      }
    
  
];
