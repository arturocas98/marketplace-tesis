import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMiTiendaComponent } from './cuenta-mi-tienda.component';

describe('CuentaMiTiendaComponent', () => {
  let component: CuentaMiTiendaComponent;
  let fixture: ComponentFixture<CuentaMiTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMiTiendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMiTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
