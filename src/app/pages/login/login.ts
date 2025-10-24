import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'login.html',
  styleUrl: 'login.css'
})
export class Login implements OnInit {
  fg!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.fg = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onsubmit() {
  this.login()
   
    ;
  }


  login(){
    this.authService.login(this.fg.value).subscribe({
       next: (data)=>{
        alert("Logeado de forma exitosa.")
       },
       error(err) {
         alert("Hubo un error al logearse.")
       },
    })
  }
}

