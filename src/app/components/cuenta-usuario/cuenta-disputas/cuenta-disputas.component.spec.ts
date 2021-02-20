import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaDisputasComponent } from './cuenta-disputas.component';

describe('CuentaDisputasComponent', () => {
  let component: CuentaDisputasComponent;
  let fixture: ComponentFixture<CuentaDisputasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaDisputasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaDisputasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
