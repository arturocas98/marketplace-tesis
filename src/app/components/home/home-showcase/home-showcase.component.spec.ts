import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeShowcaseComponent } from './home-showcase.component';

describe('HomeShowcaseComponent', () => {
  let component: HomeShowcaseComponent;
  let fixture: ComponentFixture<HomeShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
