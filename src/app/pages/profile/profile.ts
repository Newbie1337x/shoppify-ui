import { Component, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from "../../components/product-card/product-card";


interface User {
  fullName: string;
  email: string;
  registerDate: Date;
  photoURL: string;
}

@Component({
  selector: 'app-profile',
  imports: [ProductCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {


  user: User;
  wishList: Product[] = [];
  displayCount = 4;

  constructor() {
    this.user = {fullName: '', email: '', registerDate: new Date(), photoURL: ''};
  }

  ngOnInit() {
    
    this.user = {
      fullName: 'Juan Pérez',
      email: 'juan.perez@example.com',
      registerDate: new Date(2023, 5, 15),
      photoURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftopdezmelhores.com.br%2Fwp-content%2Fuploads%2F2023%2F10%2Fimage-112.png&f=1&nofb=1&ipt=17e0a892eb7270c5c4701cb37248a2d3a3cfcc79eeb7a9b7466882d2928ff896'
    };

    
    this.wishList = [
      
    ];
  }

  editarPerfil() {
  }

  editarConfiguracion() {
  }

  verCompras() {
  }

  ayuda() {
  }

  verMas() {
    this.displayCount += 4;
  }
}
