import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CarritoCompraComponent } from './components/carrito-compra/carrito-compra.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListaTiendasComponent } from './lista-tiendas/lista-tiendas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { NavComponent } from './nav/nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CategoriaComponent } from './forms/categoria/categoria.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { SubcategoriaComponent } from './forms/subcategoria/subcategoria.component';
import { TableComponent } from './forms/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SubcategoriaModalAddComponent } from './forms/subcategoria/subcategoria-modal-add/subcategoria-modal-add.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AprobacionProductosComponent } from './forms/aprobacion-productos/aprobacion-productos.component';
import { AprobacionModalComponent } from './forms/aprobacion-productos/aprobacion-modal/aprobacion-modal.component';
// import { NgxSummernoteModule } from 'ngx-summernote';
// import { ModalModule } from 'ngx-bootstrap';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CategoriaModalComponent } from './forms/categoria/categoria-modal/categoria-modal.component'; 
import { TagInputModule } from 'ngx-chips';
import { CategoriaEditComponent } from './forms/categoria/categoria-edit/categoria-edit.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegistroComponent,
    CarritoCompraComponent,
    CheckoutComponent,
    ListaTiendasComponent,
    DashboardComponent,
    NavComponent,
    CategoriaComponent,
    SubcategoriaComponent,
    TableComponent,
    SubcategoriaModalAddComponent,
    AprobacionProductosComponent,
    AprobacionModalComponent,
    CategoriaModalComponent,
    CategoriaEditComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    // NgxSummernoteModule
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ModalModule.forRoot(),
    MatSlideToggleModule,
    TagInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
