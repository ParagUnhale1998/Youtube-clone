import { TestBed } from '@angular/core/testing';

import { YoutubeApi2Service } from './youtube-api2.service';

describe('YoutubeApi2Service', () => {
  let service: YoutubeApi2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeApi2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
