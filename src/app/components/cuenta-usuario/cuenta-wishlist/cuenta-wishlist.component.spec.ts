import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaWishlistComponent } from './cuenta-wishlist.component';

describe('CuentaWishlistComponent', () => {
  let component: CuentaWishlistComponent;
  let fixture: ComponentFixture<CuentaWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaWishlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
