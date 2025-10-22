import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { CartPage } from './pages/cart-page/cart-page';

export const routes: Routes = [
  
    {path: 'search/:q', component: SearchResults},
    {path: "cart", component:CartPage}

    
  
];
