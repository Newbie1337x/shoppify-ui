import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search/:q',
    loadComponent: () => import('./pages/search-results/search-results').then(m => m.SearchResults)
  }
];
