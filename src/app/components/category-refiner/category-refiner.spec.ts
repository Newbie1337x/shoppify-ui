import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRefiner } from './category-refiner';

describe('CategoryRefiner', () => {
  let component: CategoryRefiner;
  let fixture: ComponentFixture<CategoryRefiner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryRefiner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryRefiner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
