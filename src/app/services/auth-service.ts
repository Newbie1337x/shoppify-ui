import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed} from '@angular/core';
import { RegisterPayload } from '../models/auth/registerPayload';
import { AuthResponse } from '../models/auth/authResponse';
import { environment } from '../../environments/environment';
import { Credentials } from '../models/auth/credentials';
import { tap } from 'rxjs';
import { StorageService } from './storage-service';
import { Router } from '@angular/router';
import { User } from '../models/auth/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Signals
  user = signal<User | null>(null)
  permits = signal<string[]>([])
  token = signal<string | null>(null)
  isLogged = computed(() => !!this.token())

  readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http:HttpClient, private storageService:StorageService, private router:Router){
  this.user.set(this.getUser())
  this.permits.set(this.getPermits())
  const tk = this.getToken()
  this.token.set(tk || null)
  }

register(payload: RegisterPayload){
return this.http.post<AuthResponse>(`${this.API_URL}/register`,payload)
.pipe(tap(rta => 
  {this.storageService.setSession(rta.token,rta.permits,rta.user)
  this.user.set(rta.user)
  this.permits.set(rta.permits)
  this.token.set(rta.token)
  this.router.navigate([""]);
  }))
.pipe(tap(rta => 
  {this.storageService.setSession(rta.token,rta.permits,rta.user)
  this.user.set(rta.user)
  this.permits.set(rta.permits)
  this.token.set(rta.token)
  this.router.navigate([""]);

  }))
}

login(credential:Credentials){
  return this.http.post<AuthResponse>(`${this.API_URL}/login`,credential)
  .pipe(tap(rta => 
    {this.storageService.setSession(rta.token,rta.permits,rta.user)
     this.user.set(rta.user)
     this.permits.set(rta.permits)
     this.token.set(rta.token)
     this.router.navigate([""]);
    }))
}

logout(){
  this.storageService.clearSession()
  this.user.set(null)
  this.token.set(null)
  this.permits.set([])
}

private getUser(){
  return this.storageService.getUser()
}

private getToken(){
   return this.storageService.getToken()
}

private getPermits(){
  return this.storageService.getPermits()
}
}