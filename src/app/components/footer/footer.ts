import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store-service';
import { ImageFallbackDirective } from '../../directives/image-fallback';
import { Store } from '../../models/store';

@Component({
  selector: 'app-footer',
  imports: [ImageFallbackDirective, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {

  store!: Store


  constructor(private storeService:StoreService){
  }
  ngOnInit(){
    this.renderStore()
  }

  renderStore() {
    this.storeService.getStore().subscribe({
      next:(value) => {
        this.store = value
      },
    })
  }

 getCurrYear() {
  return new Date().getFullYear();
}



}
