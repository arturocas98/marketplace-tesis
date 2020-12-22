import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaBreadcrumbComponent } from './cuenta-breadcrumb.component';

describe('CuentaBreadcrumbComponent', () => {
  let component: CuentaBreadcrumbComponent;
  let fixture: ComponentFixture<CuentaBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
