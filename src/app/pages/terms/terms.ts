import { Component } from '@angular/core';
import { HeaderAuth } from '../../components/header-auth/header-auth';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-terms',
  imports: [HeaderAuth,Footer],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class Terms {

}
