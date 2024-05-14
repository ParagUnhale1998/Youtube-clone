import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVideoCardComponent } from './home-video-card.component';

describe('HomeVideoCardComponent', () => {
  let component: HomeVideoCardComponent;
  let fixture: ComponentFixture<HomeVideoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeVideoCardComponent]
    });
    fixture = TestBed.createComponent(HomeVideoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
