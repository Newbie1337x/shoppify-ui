import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.css'
})
export class UserAvatar {
  showMenu = false;

  constructor(private router: Router , public auth:AuthService) {}

  toggleMenu() {
    if (!this.auth.user()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.showMenu = !this.showMenu;
  }

  hideMenu() {
    this.showMenu = false;
  }

  logout(){

Swal.fire({
  title: '¿Cerrar sesión?',
  text: 'Tu sesión actual se cerrará',
  icon: 'warning',
  iconColor: 'white',
  showCancelButton: true,
  background:"#212121",
  color:"white",
  confirmButtonColor: '#575757ff',
  cancelButtonColor: '#575757ff',
  confirmButtonText: 'Sí, cerrar sesión',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has salido correctamente de tu cuenta.',
      icon: 'success',
      background:"#212121",
  color:"white",
      confirmButtonColor: '#575757ff',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.auth.logout();
    });
  }
});

    

  }
}

