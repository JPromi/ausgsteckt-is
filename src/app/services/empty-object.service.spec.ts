import { TestBed } from '@angular/core/testing';

import { EmptyObjectService } from './empty-object.service';

describe('EmptyObjectService', () => {
  let service: EmptyObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmptyObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
