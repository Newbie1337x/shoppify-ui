import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Sale } from '../models/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseService<Sale>{
  override endpoint = 'transactions/sales';


}
