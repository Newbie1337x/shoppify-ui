import { User } from '../../models/auth/user';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatError, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ImageFallbackDirective } from '../../directives/image-fallback';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    ImageFallbackDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatError, MatLabel],
  templateUrl: './edit-profile-form.html',
  styleUrl: './edit-profile-form.css'
})

export class EditProfileForm {
  form!: FormGroup;

  constructor(
    private auth:AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileForm>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [this.data.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.data.lastName, [Validators.required, Validators.minLength(2)]],
      dni: [this.data.dni, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      phone: [this.data.phone, [Validators.required, Validators.pattern(/^\d+$/)]],
      img: [this.data.img || '']
    })
  }

  guardar() {
    if (this.form.valid) {
      const updatedUser: User = {
        ...this.data,
        ...this.form.value
      };
      this.dialogRef.close(updatedUser);
      this.auth.updateUser(updatedUser)
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar() {
    this.dialogRef.close()
  }
}
