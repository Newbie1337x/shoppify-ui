import { Routes } from '@angular/router';

import { SearchResults } from './pages/search-results/search-results';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { EndpointTest } from './pages/endpoint-test/endpoint-test';

export const routes: Routes = [
  
    {path: 'products', component: EndpointTest},
    {path: '', redirectTo: 'products', pathMatch: 'full'},
    {path: 'search/:q', component: SearchResults},
       {path: 'categories/:id', component:SearchResults},
       {path: 'products/:id', component:SearchResults},
       {path: 'products/edit/:id', component: EditProductPage}

    
  
];
