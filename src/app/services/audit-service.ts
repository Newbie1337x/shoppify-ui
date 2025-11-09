import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Transaction } from '../models/transaction';
import { HttpParams } from '@angular/common/http';
import { SalesParams } from '../models/filters/salesParams';

@Injectable({
  providedIn: 'root'
})
export class AuditService extends BaseService<Transaction> {
  override endpoint = 'sales'

  getAllTransactions(page: number, size: number, filters?: SalesParams) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as string)
        }
      })
    }

    return this.http.get<any>(this.API_URL+"/"+this.endpoint, { params })
  }
}
