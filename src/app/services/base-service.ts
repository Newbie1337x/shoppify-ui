import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ResponseJSON } from '../models/hal/responseJson';
import { ResponseList } from '../models/hal/responseList';
import { PaginatedResponse} from '../models/hal/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends { id?: number }> {
  readonly API_URL = environment.apiUrl;
  abstract endpoint: string;
  

  constructor(protected http: HttpClient) {}

  getAll(query: string = '') {
    return this.http.get<ResponseJSON<T>>(`${this.getURL()}${query}`);
  }

getList(filterParams?: any): Observable<PaginatedResponse<T>> {
  
  const defaultParams = {
    page: 0,
    size: 10
  };

  const finalParams = {
    ...defaultParams,
    ...filterParams
  };

  const params = new HttpParams({ fromObject: finalParams });
  
  return this.http.get<ResponseJSON<T>>(this.getURL(), { params }).pipe(
    map((response: ResponseJSON<T>) => {
      
      const dataList = this.unwrapEmbeddedList(response?._embedded);
      const pageInfo = response.page; 
      return { data: dataList, page: pageInfo };
    })
  );
}

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.getURL()}/${id}`);
  }

  put(obj: T): Observable<T> {
    return this.http.put<T>(`${this.getURL()}/${obj.id}`, obj);
  }

  patch(obj: T): Observable<T> {
    return this.http.patch<T>(`${this.getURL()}/${obj.id}`, obj);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${this.getURL()}/${id}`);
  }

  post(obj: T): Observable<T> {
    return this.http.post<T>(this.getURL(), obj);
  }

  getURL() {
    return `${this.API_URL}/${this.endpoint}`;
  }

  protected unwrapEmbeddedList<R>(embedded?: ResponseList<R>): R[] {
    if (!embedded) {
      return [];
    }

    if (Array.isArray(embedded.responseList)) {
      return embedded.responseList;
    }

    for (const key of Object.keys(embedded)) {
      const value = embedded[key];
      if (Array.isArray(value)) {
        return value;
      }
    }

    return [];
  }
}