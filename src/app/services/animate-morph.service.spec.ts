import { TestBed } from '@angular/core/testing';

import { AnimateMorphService } from './animate-morph.service';

describe('AnimateMorphService', () => {
  let service: AnimateMorphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimateMorphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
