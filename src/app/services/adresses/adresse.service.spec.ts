import { TestBed } from '@angular/core/testing';

import { AdresseService } from './adresse.service';

describe('AdresseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdresseService = TestBed.get(AdresseService);
    expect(service).toBeTruthy();
  });
});
