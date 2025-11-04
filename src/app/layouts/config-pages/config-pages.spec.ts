import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPages } from './config-pages';

describe('ConfigPages', () => {
  let component: ConfigPages;
  let fixture: ComponentFixture<ConfigPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
