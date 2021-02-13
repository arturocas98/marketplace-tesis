import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeaderPromotionComponent } from './components/header-promotion/header-promotion.component';
import { HeaderMobileComponent } from './components/header-mobile/header-mobile.component';
import { NewletterComponent } from './components/newletter/newletter.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { UrlsecurePipe } from './pipes/urlsecure.pipe';
import { EmpiezaVenderComponent } from './components/empieza-vender/empieza-vender.component';



@NgModule({
  declarations: [HeaderComponent, HeaderPromotionComponent, HeaderMobileComponent, NewletterComponent, FooterComponent, UrlsecurePipe, EmpiezaVenderComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    HeaderComponent,
    HeaderPromotionComponent,
    HeaderMobileComponent,
    NewletterComponent,
    FooterComponent,
    UrlsecurePipe
  ]
})
export class SharedModule { }
