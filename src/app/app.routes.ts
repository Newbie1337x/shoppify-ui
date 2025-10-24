import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';

export const routes: Routes = [
  
    {path: 'search/:q', component: SearchResults},
       {path: 'categories/:id', component:SearchResults},
       {path: 'products/:id', component:SearchResults},

    
  
];
