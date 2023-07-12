import { TestBed } from '@angular/core/testing';

import { HeurigerService } from './heuriger.service';

describe('HeurigerService', () => {
  let service: HeurigerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeurigerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
