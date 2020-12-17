import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from './producto/producto.service';
import { CategoriaService } from './categoria/categoria.service';
import { SubcategoriaService } from './categoria/sub_categoria.service';
import { VentaService } from './venta/venta.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    ProductoService,
    CategoriaService,
    SubcategoriaService,
    VentaService
  ]
})
export class CoreModule { }
