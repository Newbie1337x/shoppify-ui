import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<Product> {
  override endpoint = 'products';
}
