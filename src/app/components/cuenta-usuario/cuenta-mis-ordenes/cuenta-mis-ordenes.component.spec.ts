import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMisOrdenesComponent } from './cuenta-mis-ordenes.component';

describe('CuentaMisOrdenesComponent', () => {
  let component: CuentaMisOrdenesComponent;
  let fixture: ComponentFixture<CuentaMisOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMisOrdenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMisOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
