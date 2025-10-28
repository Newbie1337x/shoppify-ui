import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { UserAvatar } from '../user-avatar/user-avatar';
import { User } from '../../models/auth/user';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBar, UserAvatar],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{

  constructor(public auth:AuthService){
 
  }

  mostrarNav = false;
  mostrarBusquedaMovil = false;
  user! : User

  toggleNav() {
    this.mostrarNav = !this.mostrarNav;
    if (this.mostrarNav) {
      this.mostrarBusquedaMovil = false;
    }
  }

    ngOnInit(){
    // user is consumed from auth signals in template
  }

  toggleBusquedaMovil() {
    this.mostrarBusquedaMovil = !this.mostrarBusquedaMovil;
    if (this.mostrarBusquedaMovil) {
      this.mostrarNav = false;
    }
  }

  
}

