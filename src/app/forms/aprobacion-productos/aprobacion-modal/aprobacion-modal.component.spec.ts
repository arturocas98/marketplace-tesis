import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionModalComponent } from './aprobacion-modal.component';

describe('AprobacionModalComponent', () => {
  let component: AprobacionModalComponent;
  let fixture: ComponentFixture<AprobacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
