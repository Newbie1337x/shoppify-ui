import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderConfig } from './header-config';

describe('HeaderConfig', () => {
  let component: HeaderConfig;
  let fixture: ComponentFixture<HeaderConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
