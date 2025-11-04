import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { BaseService } from './base-service';
import { Purchase } from '../models/purchase';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService<Transaction> {
  override endpoint = 'transactions';

  postPurchase(p: Purchase){
    return this.http.post<Purchase>(this.endpoint+"/purchase",p)
  }

  postSale(p: Sale){
  return this.http.post<Sale>(this.endpoint+"/sale",p)
  }
 

}
