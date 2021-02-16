import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import {
  Rating,
  DinamicRating,
  DinamicReviews,
  DinamicPrice
} from '../../../functions';
@Component({
  selector: 'app-producto-right',
  templateUrl: './producto-right.component.html',
  styleUrls: ['./producto-right.component.css']
})
export class ProductoRightComponent implements OnInit {
  path: string = environment.url_image;
  products: Array<any> = [];
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  render: Boolean = true;
  cargando: Boolean = false;
  es_vendedor:boolean = false;
  constructor(private activateRoute: ActivatedRoute,
    private productsService: ProductoService,
    private userService: UsuarioService,
    private router:Router,
    private tiendaService:TiendaService  
  ) { }

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
    this.productsService.getByFilter("url", this.activateRoute.snapshot.params["param"])
      .subscribe(resp => {

        for (const i in resp) {

          this.productsService.getByFilter("tienda", resp[i].tienda)
            .subscribe(resp => {

              this.productsFnc(resp);

            })

        }

      })
  }

  /*=============================================
Declaramos función para mostrar los productos recomendados
=============================================*/

  productsFnc(response) {

    this.products = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    let i;
    let getProduct = [];

    for (i in response) {

      getProduct.push(response[i]);

    }

    /*=============================================
  Ordenamos de mayor a menor ventas el arreglo de objetos
  =============================================*/

    getProduct.sort(function (a, b) {
      return (b.ventas - a.ventas)
    })

    /*=============================================
    Filtramos el producto
    =============================================*/

    getProduct.forEach((product, index) => {

      if (index < 4) {

        this.products.push(product);

        /*=============================================
           Rating y Review
           =============================================*/

        this.rating.push(DinamicRating.fnc(this.products[index]));

        this.reviews.push(DinamicReviews.fnc(this.rating[index]));

        /*=============================================
        Price
        =============================================*/

        this.price.push(DinamicPrice.fnc(this.products[index]));

        this.cargando = false;
      }


    })

  }

  callback() {

    if (this.render) {

      this.render = false;

      Rating.fnc();

    }
  }


  addWishList(producto) {
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
