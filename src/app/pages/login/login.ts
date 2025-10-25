import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
  this.login();
  }


  login(){
    this.authService.login(this.fg.value).subscribe({
       next: ()=>{
        Swal.fire({
        title: "Bienvenido, "+ this.authService.user()?.firstName,
        text: "Has iniciado sesión correctamente.",
        icon: "success",
        background:"#212121",
        color:"white"});
       },
       error(err) {
         alert("Hubo un error al logearse.")
       },
    })
  }
}

