import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { register } from '../models/auth/register';
import { AuthResponse } from '../models/auth/authResponse';
import { environment } from '../../environments/environment';
import { Credentials } from '../models/auth/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly API_URL = `${environment.apiUrl}/auth`;
  
constructor(private http:HttpClient){}

register(register:register){
return this.http.post<AuthResponse>(`${this.API_URL}/register`,register)
}

login(credential:Credentials){
  return this.http.post<AuthResponse>(`${this.API_URL}/login`,credential)

}


}
