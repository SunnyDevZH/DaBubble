import { TestBed } from '@angular/core/testing';

import { AvatarServiceService } from './avatar-service.service';

describe('AvatarServiceService', () => {
  let service: AvatarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
