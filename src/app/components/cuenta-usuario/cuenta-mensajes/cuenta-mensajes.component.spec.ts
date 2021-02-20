import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMensajesComponent } from './cuenta-mensajes.component';

describe('CuentaMensajesComponent', () => {
  let component: CuentaMensajesComponent;
  let fixture: ComponentFixture<CuentaMensajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMensajesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMensajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
