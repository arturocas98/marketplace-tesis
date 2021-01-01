import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos/productos.component';
import { ProductosBreadcrumbComponent } from './productos-breadcrumb/productos-breadcrumb.component';
import { BestSaleItemsComponent } from './best-sale-items/best-sale-items.component';
import { ProductosRecomendadosComponent } from './productos-recomendados/productos-recomendados.component';
import { ProductosShowcaseComponent } from './productos-showcase/productos-showcase.component';


@NgModule({
  declarations: [
    ProductosComponent,
    ProductosBreadcrumbComponent,
    BestSaleItemsComponent,
    ProductosRecomendadosComponent,
    ProductosShowcaseComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule
  ]
})
export class ProductosModule { }
