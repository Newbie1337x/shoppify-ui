import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterPayload } from '../models/auth/registerPayload';
import { AuthResponse } from '../models/auth/authResponse';
import { environment } from '../../environments/environment';
import { Credentials } from '../models/auth/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly API_URL = `${environment.apiUrl}/auth`;
  
constructor(private http:HttpClient){}

register(payload: RegisterPayload){
return this.http.post<AuthResponse>(`${this.API_URL}/register`,payload)
}

login(credential:Credentials){
  return this.http.post<AuthResponse>(`${this.API_URL}/login`,credential)

}


}
