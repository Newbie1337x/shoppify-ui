import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
 

  constructor() { }

  success(message: string) {
    return Swal.fire({
      title: message,
      icon: "success",
      confirmButtonText: "Aceptar",
 
    })
  }

  error(message: string) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
      confirmButtonText: "Aceptar",
    })
  }
}