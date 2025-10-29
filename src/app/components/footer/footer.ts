import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store-service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  linkFb: string
  linkIg: string
  linkX: string
  linkYT: string
  thisYear: string
  storeAddress :string
  phone?: string




  constructor(private storeService:StoreService){
    this.linkFb = "https://facebook.com"
    this.linkIg = "https://instagram.com"
    this.linkX = "https://x.com"
    this.linkYT = "https://youtube.com"
    this.thisYear = "2025"
    this.storeAddress = "Av. SiempreViva 123, Piso 2, C.P. 1264, Nueva York, CABA"
  }
  ngOnInit(){
    this.renderStore()
  }

  renderStore(){
    this.storeService.getStore().subscribe({
      next:(value) => {
        this.phone = value.phone
      },
    })
  }



}
