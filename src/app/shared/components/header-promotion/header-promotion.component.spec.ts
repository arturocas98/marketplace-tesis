import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPromotionComponent } from './header-promotion.component';

describe('HeaderPromotionComponent', () => {
  let component: HeaderPromotionComponent;
  let fixture: ComponentFixture<HeaderPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
