import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Provider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class ProviderService extends BaseService<Provider>{
  override endpoint = "providers"
  
}
