import { User } from '../../models/auth/user';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-form.html',
  styleUrl: './edit-profile-form.css'
})

export class EditProfileForm {
  constructor(
    public dialogRef: MatDialogRef<EditProfileForm>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  guardar() {
    this.dialogRef.close(this.data);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
