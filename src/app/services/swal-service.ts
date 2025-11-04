import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  private confirmButtonColor: string = "#ff7543"

  constructor() { }

  success(message: string) {
    return Swal.fire({
      title: message,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: this.confirmButtonColor 
    })
  }

  error(message: string) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
      confirmButtonText: "Aceptar",
      confirmButtonColor: this.confirmButtonColor
    })
  }
}