import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from './producto/producto.service';
import { CategoriaService } from './categoria/categoria.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    ProductoService,
    CategoriaService
  ]
})
export class CoreModule { }
