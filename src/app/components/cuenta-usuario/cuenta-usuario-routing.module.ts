import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CuentaMisComprasComponent } from './cuenta-mis-compras/cuenta-mis-compras.component';
import { CuentaComponent } from './cuenta/cuenta.component';

const routes: Routes = [
  {path:'cuenta',component:CuentaComponent, canActivate:[AuthGuard]},
  {path:'cuenta/:param',component:CuentaComponent, canActivate:[AuthGuard]},

  // {path:'mis-compras',component:CuentaMisComprasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaUsuarioRoutingModule { }
