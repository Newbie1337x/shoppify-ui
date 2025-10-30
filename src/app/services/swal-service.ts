import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  confirmButtonColor: string = "#ff7543"

  constructor() { }

  success(title: string) {
    return Swal.fire({
      title: title,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: this.confirmButtonColor 
    })
  }

  error(title: string) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: title,
      confirmButtonText: "Aceptar",
      confirmButtonColor: this.confirmButtonColor
    })
  }
}