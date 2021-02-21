import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { NavComponent } from './nav/nav.component';
// import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    // component: NavComponent,
    children: [
      
      {
        path: '',
        // component: DashboardComponent
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
