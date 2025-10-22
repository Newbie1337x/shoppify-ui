import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { UserAvatar } from '../user-avatar/user-avatar';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    SearchBar,
    UserAvatar
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  mostrarNav = false;
  mostrarBusquedaMovil = false;

  toggleNav() {
    this.mostrarNav = !this.mostrarNav;
    if (this.mostrarNav) {
      this.mostrarBusquedaMovil = false;
    }
  }

  toggleBusquedaMovil() {
    this.mostrarBusquedaMovil = !this.mostrarBusquedaMovil;
    if (this.mostrarBusquedaMovil) {
      this.mostrarNav = false;
    }
  }

}
