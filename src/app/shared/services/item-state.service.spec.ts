import { TestBed } from '@angular/core/testing';

import { ItemStateService } from './item-state.service';

describe('ItemStateService', () => {
  let service: ItemStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
