import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAuth } from "../../components/header-auth/header-auth";
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, HeaderAuth],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {

}
