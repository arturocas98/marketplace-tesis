import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionProductosComponent } from './aprobacion-productos.component';

describe('AprobacionProductosComponent', () => {
  let component: AprobacionProductosComponent;
  let fixture: ComponentFixture<AprobacionProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
