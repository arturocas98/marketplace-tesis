import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';

@Component({
  selector: 'app-productos-breadcrumb',
  templateUrl: './productos-breadcrumb.component.html',
  styleUrls: ['./productos-breadcrumb.component.css']
})
export class ProductosBreadcrumbComponent implements OnInit {
  public breadcrumb: string;
  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService,
    private activateRoute: ActivatedRoute
  ) {
    this.breadcrumb = "";
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(res => {
      let param = res.param;
      this.categoriaService.getByFilter('url', param).subscribe(resp1 => {
        if (Object.keys(resp1).length > 0) {
          for (const i in resp1) {
            this.breadcrumb = resp1[i].nombre;
            let id = Object.keys(resp1).toString();

            let value = {
              "vistas": Number(resp1[i].vistas + 1)
            }
            this.categoriaService.patchData(id, value).subscribe(resp => { })
          }
        } else {
          this.subcategoriaService.getByFilter('url', param).subscribe(resp2 => {

            for (const i in resp2) {

              this.breadcrumb = resp2[i].nombre;
              let id = Object.keys(resp2).toString();

              let value = {
                "vistas": Number(resp2[i].vistas + 1)
              }
              this.subcategoriaService.patchData(id, value).subscribe(resp => { })
            }
          });
        }

      });
    })
  }

}
