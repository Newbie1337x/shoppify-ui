import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store-service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../models/store';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-store-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './store-form.html',
  styleUrl: './store-form.css'
})
export class StoreForm implements OnInit {

  fg!: FormGroup;
  store!: Store
  storePreview! : Store

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.forminit()
    this.renderStore()
    this.initListenerChanges()
  }

  renderStore(){
    this.storeService.getStore().subscribe({
      next: (data) => {
      this.store = data
      this.storePreview = data
      this.fg.patchValue(this.store)
      },
      error(err) {
        Swal.fire({
          //Configurar 
        })
      },
    })
  }

initListenerChanges() {
    this.fg.valueChanges.subscribe(formValues => {
      this.storePreview = { ...this.store, ...formValues };
    });
  }



  forminit(){
      this.fg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('', Validators.required),
      city: new FormControl('',Validators.required),
      phone: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
    });
  }

  onCancel(){

  }
  onSubmit(){}


}