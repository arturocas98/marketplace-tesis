import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaPerfilComponent } from './cuenta-perfil.component';

describe('CuentaPerfilComponent', () => {
  let component: CuentaPerfilComponent;
  let fixture: ComponentFixture<CuentaPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
