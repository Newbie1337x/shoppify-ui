import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends BaseService<Purchase> {
  override endpoint = 'purchases';


}
