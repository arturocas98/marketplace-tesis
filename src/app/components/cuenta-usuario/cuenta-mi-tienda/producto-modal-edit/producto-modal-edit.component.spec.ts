import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoModalEditComponent } from './producto-modal-edit.component';

describe('ProductoModalEditComponent', () => {
  let component: ProductoModalEditComponent;
  let fixture: ComponentFixture<ProductoModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoModalEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
