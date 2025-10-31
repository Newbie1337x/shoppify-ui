import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsRefiner } from './product-refiner';

describe('ProductsRefiner', () => {
  let component: ProductsRefiner;
  let fixture: ComponentFixture<ProductsRefiner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsRefiner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsRefiner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
