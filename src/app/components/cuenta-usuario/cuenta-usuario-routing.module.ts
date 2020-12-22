import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaComponent } from './cuenta/cuenta.component';

const routes: Routes = [
  {path:'cuenta',component:CuentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaUsuarioRoutingModule { }
