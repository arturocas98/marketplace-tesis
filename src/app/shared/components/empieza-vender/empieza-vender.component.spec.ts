import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpiezaVenderComponent } from './empieza-vender.component';

describe('EmpiezaVenderComponent', () => {
  let component: EmpiezaVenderComponent;
  let fixture: ComponentFixture<EmpiezaVenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpiezaVenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpiezaVenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
