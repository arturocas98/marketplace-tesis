import { Component, OnInit } from '@angular/core';
import { SearchComponent } from 'src/app/components/search/search/search.component';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { SiteToggleAction } from '../../../functions';
import { Search } from '../../../functions';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {
  public url_image:string = environment.url_image;
  public categorias:any;
  public render: boolean;
  public categoria_list:Array<any>;
  public authValidate : boolean = false;
  public picture:string = "";
  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService,
    private userService:UsuarioService
  ) { 
    this.categorias = [];
    this.render = true;
    this.categoria_list = [];
  }

  ngOnInit(): void {
    this.getAll();
    this.userService.authActivate().then(resp=>{
      if (resp) {
        this.authValidate =  true;
        this.userService.getFilterData("idToken",localStorage.getItem('idToken')).subscribe(res=>{
          for(const i in res){
            if (res[i].imagen != undefined) {
              if (res[i].metodo_registro != 'directo') {
                this.picture = `<a href="/cuenta-usuario/cuenta" ><img class="img-fluid rounded-circle ml-auto" style="width:40px;"   src="${res[i].imagen}" ></a> `;
              }else{
                this.picture = `<img class="img-fluid rounded-circle  ml-auto" style="width:40px;" src="assets/img/users/${res[i].username.toLowerCase()}/${res[i].imagen}" >`;
              }
            }else{
              this.picture = `<a href="/cuenta-usuario/cuenta" ><i class="icon-user"></i></a>
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
        for (const i in res) {
          this.categoria_list.push(res[i].nombre);
        }
      }, err => {
        console.log(err);
      }
    );

    $(document).on("click",".sub-toggle",function(){
      $(this).parent().children('ul').toggle()
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
                $(`[categorias='${categoria}']`).append(
  
                  `<li>
                    <a href="productos/${subcategorias[i].url}">${subcategorias[i].subcategoria}</a>
                  </li>`

                )

              }
            }
          }
        )
      });
      SiteToggleAction.fnc();
    }
  }

  goSearch(value:string){
    if (value.length == 0 || Search.fnc(value) == undefined ) {
      return;
    }

    window.open(`search/${Search.fnc(value)}`  ,'_top')
  }

}
