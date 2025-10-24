import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  
    {path: 'search/:q', component: SearchResults},
       {path: 'categories/:id', component:SearchResults},
       {path: 'products/:id', component:SearchResults},
        {path: 'login', component:Login},
          {path: 'register', component:Register},

    
  
];
