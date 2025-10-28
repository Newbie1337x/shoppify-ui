import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { RegisterPayload } from '../../models/auth/registerPayload';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{


  fg!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.fg = this.fb.group({
      //Credentials
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],

      //User
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],

    });
  }

  onsubmit() {
  this.register()
  }

  register(){
    const { firstName, lastName, dni, phone, email, password } = this.fg.value;

    const register: RegisterPayload = {
      user: { firstName, lastName, dni, phone,email},
      credentials: { email, password }
    };

    this.authService.register(register).subscribe({
       next: (data)=>{
        alert("registrado de forma exitosa.")
       },
       error(err) {
         alert("Hubo un error al registrarse.")
       },
    })
  }

}
