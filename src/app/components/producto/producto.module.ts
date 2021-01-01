import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto/producto.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { ProductoBreadcrumbComponent } from './producto-breadcrumb/producto-breadcrumb.component';
import { ProductoLeftComponent } from './producto-left/producto-left.component';
import { ProductoRightComponent } from './producto-right/producto-right.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoughtTogetherComponent } from './producto-left/bought-together/bought-together.component';
import { VendorStoreComponent } from './producto-left/vendor-store/vendor-store.component';
import { ReviewsComponent } from './producto-left/reviews/reviews.component';
import { CompraSimilarComponent } from './compra-similar/compra-similar.component';
import { ProductoRelacionadoComponent } from './producto-relacionado/producto-relacionado.component';


@NgModule({
  declarations: [
    ProductoComponent,
    CallToActionComponent,
    ProductoBreadcrumbComponent,
    ProductoLeftComponent,
    ProductoRightComponent,
    BoughtTogetherComponent,
    VendorStoreComponent,
    ReviewsComponent,
    CompraSimilarComponent,
    ProductoRelacionadoComponent,
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    SharedModule
  ]
})
export class ProductoModule { }
