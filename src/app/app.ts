import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderAuth } from "./components/header-auth/header-auth";



@Component({
  selector: 'app-root',
 
  imports: [RouterOutlet, EndpointTest, Header, Footer, HeaderAuth],


  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shoppify-ui');
}
