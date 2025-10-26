import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAuth } from './footer-auth';

describe('FooterAuth', () => {
  let component: FooterAuth;
  let fixture: ComponentFixture<FooterAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterAuth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
