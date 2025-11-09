import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { BaseService } from './base-service';
import { Purchase } from '../models/purchase';
import { SaleRequest } from '../models/sale';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService<Transaction> {
  override endpoint = 'transactions';
  private readonly API = environment.apiUrl;

  constructor(protected override http: HttpClient) {
    super(http)
  }

  postPurchase(p: Purchase) {
    return this.http.post<Purchase>(this.API+"/purchases", p)
  }

  postSale(p: SaleRequest) {
    return this.http.post<SaleRequest>(this.API+"/"+this.endpoint+"/sales", p)
  }
 

}
