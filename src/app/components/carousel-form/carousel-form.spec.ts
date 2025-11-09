import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselForm } from './carousel-form';

describe('CarouselForm', () => {
  let component: CarouselForm;
  let fixture: ComponentFixture<CarouselForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
