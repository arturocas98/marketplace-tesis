import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from './producto/producto.service';
import { CategoriaService } from './categoria/categoria.service';
import { SubcategoriaService } from './categoria/sub_categoria.service';
import { VentaService } from './venta/venta.service';
import { TiendaService } from './tienda/tienda.service';
import { DisputaService } from './disputa/disputa.service';
import { OrdenesService } from './ordenes/ordenes.service';
import { MensajeService } from './mensaje/mensaje.service';
import { OrdenService } from './orden/orden.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    ProductoService,
    CategoriaService,
    SubcategoriaService,
    VentaService,
    TiendaService,
    DisputaService,
    OrdenesService,
    MensajeService,
    OrdenService
  ]
})
export class CoreModule { }
