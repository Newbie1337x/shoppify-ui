import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EndpointTest } from "./pages/endpoint-test/endpoint-test";
import { Header } from "./components/header/header";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EndpointTest, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shoppify-ui');
}
