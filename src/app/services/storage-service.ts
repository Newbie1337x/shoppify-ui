import { Injectable } from '@angular/core';
import { User } from '../models/auth/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService{


  setSession(token:string,permits:string[],user:User){
  localStorage.setItem('token',token)
  localStorage.setItem('permits',JSON.stringify(permits))
  localStorage.setItem('user',JSON.stringify(user))
  }

  clearSession(){
    localStorage.clear()
  }

  getToken(){
    return localStorage.getItem('token') || ''
  }

  getPermits(){
    return JSON.parse(localStorage.getItem('permits') || '[]') 
  }

  getUser(){
    return JSON.parse(localStorage.getItem('user') || 'null')
}

  setUser(user: User | null) {
    if (!user) {
      localStorage.removeItem('user')
      return
    }
    localStorage.setItem('user', JSON.stringify(user))
  }


}
