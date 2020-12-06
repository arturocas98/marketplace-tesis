import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path:'', component:HomeComponent  },
  { path:'home-banner', component:HomeBannerComponent  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
