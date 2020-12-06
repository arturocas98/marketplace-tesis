import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

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

      {
        path:'',
        redirectTo:'/home',
        pathMatch:'full'
      },
      {
        path:'home',
        loadChildren:()=> import ('./components/home/home.module').then(m=>m.HomeModule)

      },
      {
        path:'producto',
        
        loadChildren:()=> import ('./components/producto/producto.module').then(m=> m.ProductoModule)
        //para que cargar un modulo hijo 
      },
      {
        path:'productos',
        // canActivate:[AdminGuard],
        loadChildren:()=> import ('./components/productos/productos.module').then(m=> m.ProductosModule)
      },
      {
        path:'search',
        
        loadChildren:()=> import ('./components/search/search.module').then(m=> m.SearchModule)
        //para que cargar un modulo hijo 
      },

      // {
      //   path:'auth',
        
      //   loadChildren:()=> import ('./auth/auth.module').then(m=> m.AuthModule)
      //   //para que cargar un modulo hijo 
      // },
      

    ]
  },
  {
    path:'**',
    component: PageNotFoundComponent
  }
//   {
//     path:'demo',
//     component: DemoComponent
//   },
//   {
//     path:'admin',
//     canActivate:[AdminGuard],
//     loadChildren:()=> import ('./admin/admin-routing.module').then(m=> m.AdminRoutingModule)
//   },


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules // precargar modulos en el main cuando ya exista una conexion disponible
  }
    
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


