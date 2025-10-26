import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  mostrarRedes = false;

  toggleRedes() {
    this.mostrarRedes = !this.mostrarRedes;
  }
}

