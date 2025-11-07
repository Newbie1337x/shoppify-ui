import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store-service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-store-form',
  imports: [ReactiveFormsModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.css'
})
export class StoreForm implements OnInit {

  fg!: FormGroup;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.fg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('', Validators.required),
      phone: new FormControl(''),
      isOpen: new FormControl(true)
    });
  }
}