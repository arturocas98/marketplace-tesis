import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';

@Component({
  selector: 'app-producto-breadcrumb',
  templateUrl: './producto-breadcrumb.component.html',
  styleUrls: ['./producto-breadcrumb.component.css']
})
export class ProductoBreadcrumbComponent implements OnInit {

  breadcrumb: string = null;

  constructor(private activateRoute: ActivatedRoute,
    private productsService: ProductoService) { }

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
        console.log("vistas productos:",value.vistas);
        this.productsService.patchData(id, value)
          .subscribe(resp => { })

      }

    })


  }

}
