import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchComponent } from 'src/app/components/search/search/search.component';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { SiteToggleAction } from '../../../functions';
import { Search,DinamicPrice, Sweetalert } from '../../../functions';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {
  public url_image:string = environment.url_image;
  public categorias:any[] = [];
  public render: boolean;
  public categoria_list:Array<any>;
  public authValidate : boolean = false;
  public picture:string = "";
  public shoppingCart: any[] = [];
  public totalShoppingCart: number = 0;
  public renderShopping: boolean = true;
  subTotal: string = `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`;
  public es_vendedor:boolean = false;
  installEvent = null;

  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService,
    private userService:UsuarioService,
    private productService:ProductoService,
    private router:Router,
    private tiendaService:TiendaService
  ) { 
    // this.categorias = [];
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
            
            this.tiendaService.getFilterData('username',res[i].username).subscribe(respTienda=>{
              
              if (Object.keys(respTienda).length > 0) {
                this.es_vendedor = true;
              } else {
                this.es_vendedor = false;
              }
              if (res[i].imagen != undefined) {
                if (res[i].metodo_registro != 'directo') {
  
                  if (this.es_vendedor) {
                    
                    this.picture = `<a href="/cuenta-usuario/cuenta/mi-tienda" ><img class="img-fluid rounded-circle ml-auto" style="width:40px;"   src="${res[i].imagen}" ></a> `;
                  }else{
                  
                    this.picture = `<a href="/cuenta-usuario/cuenta" ><img class="img-fluid rounded-circle ml-auto" style="width:40px;"   src="${res[i].imagen}" ></a> `;
                  }
  
                }else{
                  this.picture = `<img class="img-fluid rounded-circle  ml-auto" style="width:40px;" src="assets/img/users/${res[i].username.toLowerCase()}/${res[i].imagen}" >`;
                }
              }else{
                if (this.es_vendedor) {
                  this.picture = `<a href="/cuenta-usuario/cuenta/mi-tienda" ><i class="icon-user"></i></a>`
                }else{
                  this.picture = `<a href="/cuenta-usuario/cuenta" ><i class="icon-user"></i></a>`
                }
              }
            });
            
            
          }
        })
      }
    })
    if (localStorage.getItem('list-shopping-cart')) {
      let list = JSON.parse(localStorage.getItem('list-shopping-cart'));
      this.totalShoppingCart = list.length;

      for (const i in list) {
        this.productService.getByFilter('url', list[i].producto).subscribe(
          res => {
            for (const j in res) {
              this.shoppingCart.push({
                url: res[j].url,
                nombre: res[j].nombre,
                imagen: res[j].imagen,
                tiempo_entrega: res[j].tiempo_entrega,
                cantidad: list[i].unidad,
                precio: DinamicPrice.fnc(res[j])[0],
                shipping: res[j].shipping,
                categoria: res[j].categoria,
              });
            }
          }
        )
      }
    }
  }

  getAll() {
    this.categoriaService.getAll().subscribe(
      res => {
        for (const i in res) {
          this.categorias.push(res[i]);

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

  callbackShooping() {

    if (this.renderShopping) {

      this.renderShopping = false;

      /*=============================================
      Sumar valores para el precio total
      =============================================*/

      let totalProduct = $(".ps-product--cart-mobile");

      setTimeout(function () {

        let price = $(".pShoppingHeaderM .end-price")
        let quantity = $(".qShoppingHeaderM");
        let shipping = $(".sShoppingHeaderM");

        let totalPrice = 0;

        for (let i = 0; i < price.length; i++) {

          /*=============================================
          Sumar precio con envío
          =============================================*/

          // let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());

          // totalPrice += Number($(quantity[i]).html() * shipping_price)

          totalPrice += Number($(quantity[i]).html()) * Number($(price[i]).html());


        }

        $(".subTotalHeader").html(`$${totalPrice.toFixed(2)}`)

      }, totalProduct.length * 500)

    }

  }


  removeProduct(product) {


    if (localStorage.getItem("list-shopping-cart")) {

      let shoppingCart = JSON.parse(localStorage.getItem("list-shopping-cart"));
      shoppingCart.forEach((list, index) => {

        if (list.producto == product) {

          shoppingCart.splice(index, 1);

        }

      })

      /*=============================================
       Actualizamos en LocalStorage la lista del carrito de compras
       =============================================*/

      localStorage.setItem("list-shopping-cart", JSON.stringify(shoppingCart));

      Sweetalert.fnc("success", "Producto removido ", this.router.url)

    }

  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    console.log(event);
    event.preventDefault();
    this.installEvent = event;
  }

  installByUser() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent.userChoice
      .then(rta => {
        console.log(rta);
      });
    }
  }

}
