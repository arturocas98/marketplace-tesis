import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriaModalAddComponent } from './subcategoria-modal-add.component';

describe('SubcategoriaModalAddComponent', () => {
  let component: SubcategoriaModalAddComponent;
  let fixture: ComponentFixture<SubcategoriaModalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoriaModalAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriaModalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
