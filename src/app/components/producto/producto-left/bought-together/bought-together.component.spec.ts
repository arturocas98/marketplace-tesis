import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtTogetherComponent } from './bought-together.component';

describe('BoughtTogetherComponent', () => {
  let component: BoughtTogetherComponent;
  let fixture: ComponentFixture<BoughtTogetherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoughtTogetherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoughtTogetherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
