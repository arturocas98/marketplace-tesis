import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { OwlCarouselConfig, 
  carouselNavigation, 
  Rating,
    DinamicRating, 
    DinamicReviews, 
    DinamicPrice  } from '../../../functions';
@Component({
  selector: 'app-productos-recomendados',
  templateUrl: './productos-recomendados.component.html',
  styleUrls: ['./productos-recomendados.component.css']
})
export class ProductosRecomendadosComponent implements OnInit {

  path: String =  environment.url_image;
  recommendedItems: Array<any> = [];
  render: Boolean = true;
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  cargando: Boolean = false;

  constructor(
    private productsService: ProductoService,
    private activateRoute: ActivatedRoute,
    private userService:UsuarioService,
    private router:Router

  ){

  }

  ngOnInit(): void {

    this.cargando = true;

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
      return (b.vistas - a.vistas)
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
