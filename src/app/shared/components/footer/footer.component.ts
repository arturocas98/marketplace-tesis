import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { environment } from 'src/environments/environment';
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public url_image:string = environment.url_image;
  public categorias: any;
  public render: boolean;
  public categoria_list:Array<any>;
  constructor(
    public categoriasService:CategoriaService,
    public subcategoriaService:SubcategoriaService
  ) {
    this.categorias = [];
    this.render = true;
    this.categoria_list = [];
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.categoriasService.getAll().subscribe(res=>{
      this.categorias = res;
      for (const i in res) {
        this.categoria_list.push(res[i].nombre);
      }
    });
  }

  getSubcategorias(){
    if(this.render){
      this.render = false;
      let subcategorias = [];
      this.categoria_list.forEach(categoria=>{
        this.subcategoriaService.getByFilter("categoria",categoria).subscribe(
          res=>{
            for (const i in res) {
              subcategorias.push(
                {
                  "categoria":res[i].categoria,
                  "subcategoria":res[i].nombre,
                  "url": res[i].url,

                }
              )
            }
            for (const i in subcategorias) {
              if (categoria == subcategorias[i].categoria) {
                $(`[categorias-footer='${categoria}']`).append(
  
                  `
                    <a href="productos/${subcategorias[i].url}">${subcategorias[i].subcategoria}</a>
                  `

                )

              }
            }
          }
        )
      });
    }
  }

}
