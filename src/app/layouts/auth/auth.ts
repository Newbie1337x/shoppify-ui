import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAuth } from "../../components/header-auth/header-auth";  
import { FooterAuth } from "../../components/footer-auth/footer-auth";
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, HeaderAuth, FooterAuth],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {

}
