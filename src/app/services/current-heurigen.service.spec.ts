import { TestBed } from '@angular/core/testing';

import { CurrentHeurigenService } from './current-heurigen.service';

describe('CurrentHeurigenService', () => {
  let service: CurrentHeurigenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentHeurigenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
