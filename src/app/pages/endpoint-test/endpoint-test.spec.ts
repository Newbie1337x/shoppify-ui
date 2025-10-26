import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointTest } from './endpoint-test';

describe('EndpointTest', () => {
  let component: EndpointTest;
  let fixture: ComponentFixture<EndpointTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndpointTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndpointTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
