import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageValidatorService {

  checkImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      img.src = url;
    });
  }
}