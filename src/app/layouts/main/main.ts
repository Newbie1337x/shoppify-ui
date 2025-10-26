import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {

}
