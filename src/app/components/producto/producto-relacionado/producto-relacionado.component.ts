import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { OwlCarouselConfig, 
  carouselNavigation,
  Rating, 
  DinamicRating, 
    DinamicReviews, 
    DinamicPrice   } from '../../../functions';
@Component({
  selector: 'app-producto-relacionado',
  templateUrl: './producto-relacionado.component.html',
  styleUrls: ['./producto-relacionado.component.css']
})
export class ProductoRelacionadoComponent implements OnInit {

  path: String = environment.url_image;
  products: Array<any> = [];
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  render: Boolean = true;
  cargando: Boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private productsService: ProductoService,
    private userService:UsuarioService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.cargando = true;

    this.productsService.getByFilter("url", this.activateRoute.snapshot.params["param"])
      .subscribe(resp => {

        for (const i in resp) {

          this.productsService.getByFilter("categoria", resp[i].categoria)
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
  Ordenamos de mayor a menor views el arreglo de objetos
  =============================================*/

    getProduct.sort(function (a, b) {
      return (b.vistas - a.vistas)
    })

    /*=============================================
    Filtramos el producto
    =============================================*/

    getProduct.forEach((product, index) => {

      if (index < 10) {

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

      setTimeout(function () {

        OwlCarouselConfig.fnc();

        carouselNavigation.fnc();

        Rating.fnc();

      }, 1000)

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
