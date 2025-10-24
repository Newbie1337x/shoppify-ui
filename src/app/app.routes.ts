import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
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
          { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
      }
    
  
];
