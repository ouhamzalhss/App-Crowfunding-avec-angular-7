import { TestBed } from '@angular/core/testing';

import { ContributionService } from './contribution.service';

describe('ContributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContributionService = TestBed.get(ContributionService);
    expect(service).toBeTruthy();
  });
});
