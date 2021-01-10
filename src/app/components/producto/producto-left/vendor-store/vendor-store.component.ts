import { Component, Input, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-store',
  templateUrl: './vendor-store.component.html',
  styleUrls: ['./vendor-store.component.css']
})
export class VendorStoreComponent implements OnInit {
  @Input() childItem: any;
  path: string = environment.url_image;
  store: Array<any> = [];

  constructor(
    private storesService: TiendaService
  ) { }

  ngOnInit(): void {
    console.log("child item:",this.childItem);
    this.storesService.getFilterData("nombre", this.childItem)
      .subscribe(resp => {
        console.log("tiend:",resp);
        for (const i in resp) {

          this.store.push(resp[i])

        }

      })
  }

}
