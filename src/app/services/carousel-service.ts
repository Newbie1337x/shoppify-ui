import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Carouselitem} from '../models/carouselitem';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarouselService{
   readonly API_URL = `${environment.apiUrl}/stores/carousel`;
  
  constructor(private http: HttpClient) {}

  getCarousel() {
    return this.http.get<Carouselitem[]>(this.API_URL);
  }

    postCarouselItem(item:Carouselitem) {
    return this.http.post<Carouselitem>(this.API_URL,item);
  }


  putCarouselItem(item:Carouselitem){
    return this.http.put<Carouselitem>(this.API_URL+"/"+item.id,item)
}

  deleteCarouselItem(id: number) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
