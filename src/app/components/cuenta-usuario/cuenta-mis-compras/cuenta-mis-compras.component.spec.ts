import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMisComprasComponent } from './cuenta-mis-compras.component';

describe('CuentaMisComprasComponent', () => {
  let component: CuentaMisComprasComponent;
  let fixture: ComponentFixture<CuentaMisComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMisComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMisComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
