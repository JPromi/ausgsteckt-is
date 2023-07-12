import { TestBed } from '@angular/core/testing';

import { AllHeurigenService } from './all-heurigen.service';

describe('AllHeurigenService', () => {
  let service: AllHeurigenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllHeurigenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
