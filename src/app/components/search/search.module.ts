import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { SearchBreadcrumbComponent } from './search-breadcrumb/search-breadcrumb.component';
import { SearchShowcaseComponent } from './search-showcase/search-showcase.component';


@NgModule({
  declarations: [SearchComponent, SearchBreadcrumbComponent, SearchShowcaseComponent],
  imports: [
    CommonModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
