import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { HomePromotionsComponent } from './home-promotions/home-promotions.component';
import { HomeHotTodayComponent } from './home-hot-today/home-hot-today.component';
import { HomeTopCategoriesComponent } from './home-top-categories/home-top-categories.component';
import { HomeShowcaseComponent } from './home-showcase/home-showcase.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeBannerComponent,
    HomeFeaturesComponent,
    HomePromotionsComponent,
    HomeHotTodayComponent,
    HomeTopCategoriesComponent,
    HomeShowcaseComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
