import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { environment } from 'src/environments/environment';
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  url_image: string;
  public categorias: any;
  public title_list: any[];
  public render: boolean;
  public subcategoria_list: any;
  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService
  ) {
    this.url_image = environment.url_image;
    this.categorias = [];
    this.title_list = [];
    this.render = true;
    this.subcategoria_list = [];
  }

  ngOnInit(): void {
    this.getAll();

  }

  getAll() {
    this.categoriaService.getAll().subscribe(
      res => {
        console.log(res);
        this.categorias = res;
        // console.log(this.categorias);
        for (const i in this.categorias) {
          this.title_list.push(JSON.parse(this.categorias[i].titulo_lista));
          // console.log("title_list:",this.title_list);
        }
      }, err => {
        console.log(err);
      }
    );

  }

  getSubcategorias() {
    if (this.render) {
      this.render = false;
      let subcategorias = [];
      let title_name = [];

      this.title_list.forEach(list => {

        for (let i = 0; i < list.length; i++) {

          this.subcategoriaService.getByFilter("titulo_lista", list[i]).subscribe(
            res => {
              subcategorias.push(res);

              for(const f in subcategorias){
							
                /*=============================================
                Hacemos un recorrido por la colección particular de subcategorias
                =============================================*/
  
                for(const g in subcategorias[f]){
  
                  /*=============================================
                  Creamos un nuevo array de objetos clasificando cada subcategoría con la respectiva lista de título a la que pertenece
                  =============================================*/
  
                  title_name.push({
  
                    "titulo_lista": subcategorias[f][g].titulo_lista,
                    "subcategoria": subcategorias[f][g].nombre,
                    "url": subcategorias[f][g].url,
  
                  })
  
                }
  
              }

              for(const z in title_name){

                if(list[i] == title_name[z].titulo_lista){
                  
                  /*=============================================
                  Imprimir el nombre de subcategoría debajo de el listado correspondiente
                  =============================================*/
  
                  $(`[titleList='${list[i]}']`).append(
  
                    `<li>
                      <a href="productos/${title_name[z].url}">${title_name[z].subcategoria}</a>
                    </li>`
  
                  )
              
                }
  
              }

            }
          );
        }
        

      });

    }
  }

}
