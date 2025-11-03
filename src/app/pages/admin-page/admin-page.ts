import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css']
})
export class AdminPage {

  constructor(
  private router : Router
  ){}


createProduct(){
  this.router.navigate([""]);
}

}

