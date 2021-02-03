import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import * as Cookies from 'js-cookie';

@Component({
  selector: 'app-producto-breadcrumb',
  templateUrl: './producto-breadcrumb.component.html',
  styleUrls: ['./producto-breadcrumb.component.css']
})
export class ProductoBreadcrumbComponent implements OnInit {

  breadcrumb: string = null;

  constructor(private activateRoute: ActivatedRoute,
    private productsService: ProductoService,
    private tiendaService: TiendaService  
  ) { }

  ngOnInit(): void {

    /*=============================================
    Capturamos el parámetro URL
    =============================================*/

    this.breadcrumb = this.activateRoute.snapshot.params["param"].replace(/[-]/g, " ");

    /*=============================================
    Actualizar vistas de producto
    =============================================*/

    this.productsService.getByFilter("url", this.activateRoute.snapshot.params["param"]).subscribe(resp => {

      for (const i in resp) {

        let id = Object.keys(resp).toString();

        let value = {
          "vistas": Number(resp[i].vistas + 1)
        }
        this.productsService.patchData(id, value)
          .subscribe(resp => { })

      }

    })

    /*=============================================
       Capturamos el parámetro URL del cupón de la tienda
       =============================================*/

    if (this.activateRoute.snapshot.queryParams["coupon"] != undefined) {

      this.tiendaService.getFilterData("url", this.activateRoute.snapshot.queryParams["coupon"])
        .subscribe(resp => {

          for (const i in resp) {

            Cookies.set('cupon', resp[i].url, { expires: 7 })

          }

        })

    }


  }

}
