import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { OwlCarouselConfig, carouselNavigation, Rating, DinamicRating, DinamicReviews, DinamicPrice,Sweetalert } from '../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-best-sale-items',
  templateUrl: './best-sale-items.component.html',
  styleUrls: ['./best-sale-items.component.css']
})
export class BestSaleItemsComponent implements OnInit {
  path: String = environment.url_image;
  recommendedItems: Array<any> = [];
  render: Boolean = true;
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  cargando: Boolean = false;
  es_vendedor:boolean = false;
  constructor(
    private productsService: ProductoService,
    private activateRoute: ActivatedRoute,
    private userService : UsuarioService,
    private router:Router,
    private tiendaService:TiendaService

  ){

  }

  ngOnInit(): void {

    this.cargando = true;

    this.userService.getFilterData("idToken",localStorage.getItem('idToken')).subscribe(resp=>{
      for(const i in resp){
        this.tiendaService.getFilterData('username',resp[i].username).subscribe(respTienda=>{
          if (Object.keys(respTienda).length > 0) {
            this.es_vendedor = true;
          }else{
            this.es_vendedor = false;
          }
        });
      }
    });

    /*=============================================
    Capturamos el parámetro URL
    =============================================*/

    let params = this.activateRoute.snapshot.params["param"].split("&")[0];

    /*=============================================
    Filtramos data de productos con categorías
    =============================================*/

    this.productsService.getByFilter("categoria", params)
      .subscribe(resp1 => {

        if (Object.keys(resp1).length > 0) {

          this.productsFnc(resp1);

        } else {

          /*=============================================
          Filtramos data de subategorías
          =============================================*/

          this.productsService.getByFilter("subcategoria", params)
            .subscribe(resp2 => {

              this.productsFnc(resp2);

            })

        }

      })

  }

  /*=============================================
Declaramos función para mostrar los productos recomendados
=============================================*/

  productsFnc(response) {

    this.recommendedItems = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    let i;
    let getSales = [];

    for (i in response) {

      getSales.push(response[i]);

    }

    /*=============================================
    Ordenamos de mayor a menor ventas el arreglo de objetos
    =============================================*/

    getSales.sort(function (a, b) {
      return (b.ventas - a.ventas)
    })

    /*=============================================
    Filtramos solo hasta 10 productos
    =============================================*/

    getSales.forEach((product, index) => {

      if (index < 10) {

        this.recommendedItems.push(product);

        this.rating.push(DinamicRating.fnc(this.recommendedItems[index]));
       

        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        this.price.push(DinamicPrice.fnc(this.recommendedItems[index]));

        this.cargando = false;
        setTimeout(function(){
          Rating.fnc();
        },index*100);
      }

    })

  }

  /*=============================================
Función que nos avisa cuando finaliza el renderizado de Angular
=============================================*/

  callback() {

    if (this.render) {

      this.render = false;

      OwlCarouselConfig.fnc();
      carouselNavigation.fnc();

    }

  }

  addWishList(producto){
    this.userService.wishlist(producto);
  }

  addShoppingCart(producto,unidad,detalles){
    let url = this.router.url;
     

    let item = {
      producto:producto,
      unidad:unidad,
      detalles:detalles,
      url:url
    }
    this.userService.addShoppingCart(item)
  }

}
