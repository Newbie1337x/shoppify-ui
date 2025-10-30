import { Injectable } from '@angular/core';import { User } from '../models/auth/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService{


  setSession(token:string,permits:string[],user:User){
    try {
      localStorage.setItem('token',token)
      localStorage.setItem('permits',JSON.stringify(permits))
      localStorage.setItem('user',JSON.stringify(user))
    } catch (e) {/* almacenamiento no soportado/bloqueado */}
  }

  clearSession(){
    try {
      localStorage.clear()
    } catch (e) {/* nada que limpiar o acceso denegado */}
  }

  getToken(){
    try {
      return localStorage.getItem('token') || ''
    } catch (e) { return '' }
  }

  getPermits(){
    try {
      return JSON.parse(localStorage.getItem('permits') || '[]') 
    } catch (e) { return [] }
  }

  getUser(){
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch (e) { return null }
  }


}