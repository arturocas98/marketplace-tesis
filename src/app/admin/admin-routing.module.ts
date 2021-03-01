import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AprobacionProductosComponent } from '../forms/aprobacion-productos/aprobacion-productos.component';
import { CategoriaComponent } from '../forms/categoria/categoria.component';
import { SubcategoriaComponent } from '../forms/subcategoria/subcategoria.component';
import { NavComponent } from '../nav/nav.component';


const routes: Routes = [
  {
    // path:'', component: DashboardComponent
    path: '',
    component: NavComponent,
    children:[
      {
        path:'',
        redirectTo:'/admin/dashboard',
        pathMatch:'full'
      },
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'categoria',
        component:CategoriaComponent
      },
      {
        path:'subcategoria',
        component:SubcategoriaComponent
      },
      {
        path:'aprobacion',
        component:AprobacionProductosComponent
      }
    ]
    
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
