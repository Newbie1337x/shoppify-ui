import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCarousel } from './promotion-carousel';

describe('PromotionCarousel', () => {
  let component: PromotionCarousel;
  let fixture: ComponentFixture<PromotionCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
