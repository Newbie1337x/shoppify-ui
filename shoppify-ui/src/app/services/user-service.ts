import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  override endpoint = 'user';
}
