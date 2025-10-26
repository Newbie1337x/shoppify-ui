import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store } from '../models/store';
import { HomeCarousel } from '../models/homeCarousel';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  readonly API_URL = `${environment.apiUrl}/stores`;
  
  // Signals
  store = signal<Store | null>(null);
  hasStore = computed(() => !!this.store());
 

  constructor(private http: HttpClient) {}

  getStore() {
    return this.http.get<Store>(this.API_URL+"/singleton");
  }

  getCarousel(){
    return this.http.get<HomeCarousel>(this.API_URL+"/carousel")
  }
  putStore(store:Store){
    return this.http.put<Store>(this.API_URL,store)
}
}
