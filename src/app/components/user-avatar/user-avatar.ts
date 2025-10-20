import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Componente mínimo para el avatar/menú de usuario en el header.
// Aísla la UI para poder añadir lógica de usuario más adelante
// (foto personalizada, estados de sesión, opciones dinámicas, etc.).
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.css'
})
export class UserAvatar {
  @Input() avatarSrc: string = 'image/user.png';
  showMenu = false;

  // Emula el dropdown del footer: manejo simple por clase .show
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
