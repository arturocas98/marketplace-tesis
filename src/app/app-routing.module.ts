import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
// import { DemoComponent } from './demo/demo.component';
// import { ContactComponent } from './contact/contact.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { AdminGuard } from './admin.guard';


const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children:[

    //   {
    //     path:'',
    //     redirectTo:'/home',
    //     pathMatch:'full'
    //   },
    //   {
    //     path:'home',
    //     loadChildren:()=> import ('./home/home.module').then(m=>m.HomeModule)

    //   },
    
    //   {
    //     path:'products',
        
    //     loadChildren:()=> import ('./product/products.module').then(m=> m.ProductsModule)
    //     //para que cargar un modulo hijo 
    //   },
    //   {
    //     path:'contact',
    //     // canActivate:[AdminGuard],
    //     component: ContactComponent
    //   },
    //   {
    //     path:'order',
        
    //     loadChildren:()=> import ('./order/order.module').then(m=> m.OrderModule)
    //     //para que cargar un modulo hijo 
    //   },
    //   {
    //     path:'auth',
        
    //     loadChildren:()=> import ('./auth/auth.module').then(m=> m.AuthModule)
    //     //para que cargar un modulo hijo 
    //   },
      

    ]
  },
//   {
//     path:'demo',
//     component: DemoComponent
//   },
//   {
//     path:'admin',
//     canActivate:[AdminGuard],
//     loadChildren:()=> import ('./admin/admin-routing.module').then(m=> m.AdminRoutingModule)
//   },
//   {
//     path:'**',
//     component: PageNotFoundComponent
//   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules // precargar modulos en el main cuando ya exista una conexion disponible
  }
    
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


