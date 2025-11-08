import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionCarousel } from "../promotion-carousel/promotion-carousel";
import { CarouselService } from '../../services/carousel-service';
import { Carouselitem } from '../../models/carouselitem';
import { ImageFallbackDirective } from '../../directives/image-fallback';



@Component({
  selector: 'app-carousel-form',
  imports: [CommonModule, ReactiveFormsModule, PromotionCarousel,ImageFallbackDirective],
  templateUrl: './carousel-form.html',
  styleUrl: './carousel-form.css'
})
export class CarouselForm implements OnInit {

  carouselItems: Carouselitem[] = [];
  selectedItem? : Carouselitem
  fg!: FormGroup;


  constructor(
    private carouselService: CarouselService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.renderItems()
    this.initForm()
  }

  renderItems(){
    this.carouselService.getCarousel().subscribe({
      next:(data) => {
        this.carouselItems = data
        const id = this.route.snapshot.params['id']

        if(id){
        this.selectedItem = data.find(a => a.id == id)
        }
      },
    })
  }


  resetCurrent(){
    if(this.selectedItem){
      this.fg.patchValue(this.selectedItem)
    }
    else{
      this.fg.reset()
    }
  }



  onSubmit(){
    if(this.selectedItem){
         this.carouselService.putCarouselItem(this.fg.value).subscribe({
      next:(value) => {
          this.cleanValues()
          this.renderItems()
      },
      })
    }
    else{
      this.carouselService.postCarouselItem(this.fg.value).subscribe({
      next:(value) => {
          this.cleanValues()
          this.renderItems()
      },
      })
    }
  
  }

  onPreviewSelect(item: Carouselitem){
    this.selectedItem = item
    this.fg.patchValue(item)
  }

  onDelete(){
    this.carouselService.deleteCarouselItem(this.selectedItem!.id).subscribe({
      next:(value) => {
         this.cleanValues()
         this.renderItems()
      },
    })
  }

  initForm(){
  this.fg = this.fb.group({
    id:[''],
    title: ['', [Validators.required],],
    href: ['', [Validators.required]],
    url: ['', [Validators.required]]
  });
  }

  createItem(){
    this.cleanValues()
  }

  cleanValues(){
    this.selectedItem = undefined
    this.fg.reset()
  }

  goBack(){
    this.router.navigate(['/auth','admin'])
  }



}
