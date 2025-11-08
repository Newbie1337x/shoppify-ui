import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { HeaderConfig } from "../../components/header-config/header-config";

@Component({
  selector: 'app-config-pages',
  imports: [RouterOutlet, Footer, HeaderConfig],
  templateUrl: './config-pages.html',
  styleUrl: './config-pages.css'
})
export class ConfigPages {

}
