import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoBreadcrumbComponent } from './producto-breadcrumb.component';

describe('ProductoBreadcrumbComponent', () => {
  let component: ProductoBreadcrumbComponent;
  let fixture: ComponentFixture<ProductoBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
