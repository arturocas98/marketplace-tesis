import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaUsuarioRoutingModule } from './cuenta-usuario-routing.module';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CuentaPerfilComponent } from './cuenta-perfil/cuenta-perfil.component';
import { CuentaBreadcrumbComponent } from './cuenta-breadcrumb/cuenta-breadcrumb.component';
import { CuentaWishlistComponent } from './cuenta-wishlist/cuenta-wishlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CuentaMisComprasComponent } from './cuenta-mis-compras/cuenta-mis-compras.component';
import { CuentaNuevaTiendaComponent } from './cuenta-nueva-tienda/cuenta-nueva-tienda.component';
import { CuentaMiTiendaComponent } from './cuenta-mi-tienda/cuenta-mi-tienda.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [ 
    CuentaComponent, CuentaPerfilComponent, CuentaBreadcrumbComponent, CuentaWishlistComponent, CuentaMisComprasComponent, CuentaNuevaTiendaComponent, CuentaMiTiendaComponent,
    
  ],
  imports: [
    CommonModule,
    CuentaUsuarioRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType:'danger'
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    NgxDropzoneModule,
    TagInputModule,

  ]
})
export class CuentaUsuarioModule { }
