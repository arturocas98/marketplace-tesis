import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { Search } from '../../../functions';

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
  public authValidate : boolean = false;
  public picture:string = "";
  public wishlist : number = 0;
  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService,
    private usuarioService: UsuarioService
  ) {
    this.url_image = environment.url_image;
    this.categorias = [];
    this.title_list = [];
    this.render = true;
    this.subcategoria_list = [];
  }

  ngOnInit(): void {
    this.getAll();
    this.usuarioService.authActivate().then(resp=>{
      if (resp) {
        this.authValidate =  true;
        this.usuarioService.getFilterData("idToken",localStorage.getItem('idToken')).subscribe(res=>{
          for(const i in res){

            if(res[i].wishlist != undefined){

							this.wishlist = Number(JSON.parse(res[i].wishlist).length)
						}

            if (res[i].imagen != undefined) {
              if (res[i].metodo_registro != 'directo') {
                this.picture = `<img class="img-fluid rounded-circle w-50 ml-auto" src="${res[i].imagen}" >`;
              }else{
                this.picture = `<img class="img-fluid rounded-circle w-50 ml-auto" src="assets/img/users/${res[i].username.toLowerCase()}/${res[i].imagen}" >`;
              }
            }else{
              this.picture = `<i class="icon-user"></i>
              `
            }
          }
        })
      }
    })
  }

  getAll() {
    this.categoriaService.getAll().subscribe(
      res => {
        this.categorias = res;
        for (const i in this.categorias) {
          this.title_list.push(JSON.parse(this.categorias[i].grupo));
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

          this.subcategoriaService.getByFilter("grupo", list[i]).subscribe(
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
  
                    "grupo": subcategorias[f][g].grupo,
                    "subcategoria": subcategorias[f][g].nombre,
                    "url": subcategorias[f][g].url,
  
                  })
  
                }
  
              }

              for(const z in title_name){

                if(list[i] == title_name[z].grupo){
                  
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


  goSearch(value:string){
    if (value.length == 0 || Search.fnc(value) == undefined ) {
      return;
    }

    window.open(`search/${Search.fnc(value)}`  ,'_top')
  }

}
