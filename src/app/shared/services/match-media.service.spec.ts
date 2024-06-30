import { TestBed } from '@angular/core/testing';

import { MatchMediaService } from './match-media.service';

describe('MatchMediaService', () => {
  let service: MatchMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
