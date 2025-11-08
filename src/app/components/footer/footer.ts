import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store-service';
import { ImageFallbackDirective } from '../../directives/image-fallback';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [ImageFallbackDirective, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {

  storeService = inject(StoreService)
  linkFb = "https://facebook.com"
  linkIg = "https://instagram.com"
  linkX = "https://x.com"
  linkYT = "https://youtube.com"
  thisYear = ""
  storeAddress = "Av. SiempreViva 123, Piso 2, C.P. 1264, Nueva York, CABA"
  phone = ""

  ngOnInit() {
    this.renderStore()
  }

  renderStore() {
    this.storeService.getStore().subscribe({
      next: (value) => {
        //this.linkFb = value.facebook
        //this.linkIg = value.instagram
        //this.linkX = value.x
        //this.linkYT = value.youtube
        this.thisYear = new Date().getFullYear().toString()
        this.storeAddress = value.adress
        this.phone = value.phone
      },
    })
  }



}
