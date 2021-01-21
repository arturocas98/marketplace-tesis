import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { Rating, 
  DinamicRating, 
    DinamicReviews, 
    DinamicPrice   } from '../../../functions';
@Component({
  selector: 'app-compra-similar',
  templateUrl: './compra-similar.component.html',
  styleUrls: ['./compra-similar.component.css']
})
export class CompraSimilarComponent implements OnInit {

  path: string = environment.url_image;
  products: Array<any> = [];
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  render: Boolean = true;
  cargando: Boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private productsService: ProductoService,
    private userService:UsuarioService) { }

  ngOnInit(): void {

    this.cargando = true;

    this.productsService.getByFilter("url", this.activateRoute.snapshot.params["param"])
      .subscribe(resp => {

        for (const i in resp) {

          this.productsService.getByFilter("subcategoria", resp[i].subcategoria)
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

      if (index < 6) {

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

        Rating.fnc();

      }, 1000)

    }
  }
  
  addWishList(producto){
    this.userService.wishlist(producto);
  }
}
