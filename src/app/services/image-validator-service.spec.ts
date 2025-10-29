import { TestBed } from '@angular/core/testing';

import { ImageValidatorService } from './image-validator-service';

describe('ImageValidatorService', () => {
  let service: ImageValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
