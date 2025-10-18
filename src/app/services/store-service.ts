import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Store } from '../models/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService extends BaseService<Store>{
  override endpoint = "stores"
  
}
