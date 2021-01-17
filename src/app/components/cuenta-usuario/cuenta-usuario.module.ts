import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaUsuarioRoutingModule } from './cuenta-usuario-routing.module';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CuentaPerfilComponent } from './cuenta-perfil/cuenta-perfil.component';
import { CuentaBreadcrumbComponent } from './cuenta-breadcrumb/cuenta-breadcrumb.component';
import { CuentaWishlistComponent } from './cuenta-wishlist/cuenta-wishlist.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ 
    CuentaComponent, CuentaPerfilComponent, CuentaBreadcrumbComponent, CuentaWishlistComponent,
    
  ],
  imports: [
    CommonModule,
    CuentaUsuarioRoutingModule,
    ReactiveFormsModule
  ]
})
export class CuentaUsuarioModule { }
