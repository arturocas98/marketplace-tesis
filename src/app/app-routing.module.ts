import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CarritoCompraComponent } from './components/carrito-compra/carrito-compra.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

import { LayoutComponent } from './layout/layout.component';
import { EmpiezaVenderComponent } from './shared/components/empieza-vender/empieza-vender.component';
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
        path:'producto/:param',
        
        loadChildren:()=> import ('./components/producto/producto.module').then(m=> m.ProductoModule)
        //para que cargar un modulo hijo 
      },
      {
        path:'productos/:param',
        // canActivate:[AdminGuard],
        loadChildren:()=> import ('./components/productos/productos.module').then(m=> m.ProductosModule)
      },
      {
        path:'search/:param',
        
        loadChildren:()=> import ('./components/search/search.module').then(m=> m.SearchModule)
        //para que cargar un modulo hijo 
      },
      {
        path:'cuenta-usuario',
        
        loadChildren:()=> import ('./components/cuenta-usuario/cuenta-usuario.module').then(m=> m.CuentaUsuarioModule),
        canActivate:[AuthGuard]
        
        //para que cargar un modulo hijo 
      },
      {
        path:'login',component:LoginComponent
      },
      {
        path:'registro',component:RegistroComponent
      },
      {
        path:'carrito-compra',component:CarritoCompraComponent
      },
      {
        path:'checkout',component:CheckoutComponent,
        canActivate:[AuthGuard]
      },
      {
        path:'empieza-vender',component:EmpiezaVenderComponent
      },
      

      
      

    ]
  },
  {
    path:'admin',
    canActivate:[AdminGuard],
    loadChildren:()=> import ('./admin/admin-routing.module').then(m=> m.AdminRoutingModule)
  },
  {
    path:'**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules // precargar modulos en el main cuando ya exista una conexion disponible
  }
    
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


