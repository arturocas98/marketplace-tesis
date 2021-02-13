import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { Pagination, Rating, DinamicRating, DinamicReviews, DinamicPrice, Tabs, Select2Cofig } from '../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-search-showcase',
  templateUrl: './search-showcase.component.html',
  styleUrls: ['./search-showcase.component.css']
})
export class SearchShowcaseComponent implements OnInit {

  path: String = environment.url_image;
  products: Array<any> = [];
  render: Boolean = true;
  cargando: Boolean = false;
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  params: string = null;
  page;
  productFound: Number = 0;
  currentRoute: String = null;
  totalPage: Number = 0;
  sort;
  sortItems: Array<any> = [];
  sortValues: Array<any> = [];
  properties: Array<any> = ["nombre", "categoria", "subcategoria", "etiquetas", "grupo", "tienda"];
  listProducts: Array<any> = [];
  constructor(
    private productsService: ProductoService,
    private activateRoute: ActivatedRoute,
    private userService :UsuarioService
  ) { }

  ngOnInit(): void {

    this.cargando = true;

    /*=============================================
   Capturamos el parámetro URL
   =============================================*/

    this.params = this.activateRoute.snapshot.params["param"].split("&")[0];
    this.sort = this.activateRoute.snapshot.params["param"].split("&")[1];
    this.page = this.activateRoute.snapshot.params["param"].split("&")[2];


    this.currentRoute = `search/${this.params}`;
    /*=============================================
    Evaluamos que el segundo parámetro sea de paginación
    =============================================*/
    if (Number.isInteger(Number(this.sort))) {

      this.page = this.sort;
      this.sort = undefined;

    }

    /*=============================================
    Evaluamos que el parámetro de orden no esté definido
    =============================================*/

    if (this.sort == undefined) {

      this.currentRoute = `search/${this.params}`;

    } else {

      this.currentRoute = `search/${this.params}&${this.sort}`;

    }

    /*=============================================
    Filtramos data de productos con todas la propiedades
    =============================================*/
    this.properties.forEach(p => {
      this.productsService.getSearchData(p, this.params).subscribe(resp => {
        console.log("resp:",resp);
        for (const i in resp) {
          this.listProducts.push(resp[i]);
        }

        this.productsFnc(this.listProducts);
      })
    })
    // console.log("list_products:",this.listProducts);


  }

  /*=============================================
Declaramos función para mostrar el catálogo de productos
=============================================*/

  productsFnc(response) {
    if (response.length > 0) {
      this.products = [];

      /*=============================================
      Hacemos un recorrido por la respuesta que nos traiga el filtrado
      =============================================*/

      let i;
      let getProducts = [];
      let total = 0;

      for (i in response) {

        total++;

        getProducts.push(response[i]);

      }

      /*=============================================
      Definimos el total de productos y la paginación de productos
      =============================================*/

      this.productFound = total;
      this.totalPage = Math.ceil(Number(this.productFound) / 6);

      /*=============================================
      Ordenamos el arreglo de objetos lo mas actual a lo más antiguo
      =============================================*/
      // if (this.sort == undefined || this.sort == "first") {

      //   getProducts.sort(function (a, b) {
      //     return (b.fecha_creacion - a.fecha_creacion)
      //   })

      //   this.sortItems = [

      //     "Sort by first",
      //     "Sort by latest",
      //     "Ordenar por: popularidad",
      //     "Odernar por precio:bajo a alto",
      //     "Ordenar por precio: alto a bajo"
      //   ]

      //   this.sortValues = [

      //     "first",
      //     "latest",
      //     "popularity",
      //     "low",
      //     "high"
      //   ]

      // }

      // /*=============================================
      // Ordenamos el arreglo de objetos lo mas antiguo a lo más actual
      // =============================================*/

      // if (this.sort == "latest") {

      //   getProducts.sort(function (a, b) {
      //     return (a.fecha_creacion - b.fecha_creacion)
      //   })

      //   this.sortItems = [

      //     "Sort by latest",
      //     "Sort by first",
      //     "Ordenar por: popularidad",
      //     "Odernar por precio:bajo a alto",
      //     "Ordenar por precio: alto a bajo"
      //   ]

      //   this.sortValues = [

      //     "latest",
      //     "first",
      //     "popularity",
      //     "low",
      //     "high"
      //   ]

      // }

      /*=============================================
      Ordenamos el arreglo de objetos lo mas visto
      =============================================*/

      if (this.sort == undefined || this.sort == "popularity") {

        getProducts.sort(function (a, b) {
          return (b.vistas - a.vistas)
        })

        this.sortItems = [

          "Ordenar por: popularidad",
          // "Sort by first",
          // "Sort by latest",
          "Odernar por precio:bajo a alto",
          "Ordenar por precio: alto a bajo"
        ]

        this.sortValues = [

          "popularity",
          // "first",
          // "latest",
          "low",
          "high"
        ]

      }

      /*=============================================
      Ordenamos el arreglo de objetos de menor a mayor precio
      =============================================*/

      if (this.sort == "low") {

        getProducts.sort(function (a, b) {
          return (a.precio - b.precio)
        })

        this.sortItems = [

          "Odernar por precio:bajo a alto",
          // "Sort by first",
          // "Sort by latest",
          "Ordenar por: popularidad",
          "Ordenar por precio: alto a bajo"
        ]

        this.sortValues = [

          "low",
          // "first",
          // "latest",
          "popularity",
          "high"
        ]


      }

      /*=============================================
      Ordenamos el arreglo de objetos de mayor a menor precio
      =============================================*/

      if (this.sort == "high") {

        getProducts.sort(function (a, b) {
          return (b.precio - a.precio)
        })

        this.sortItems = [

          "Ordenar por precio: alto a bajo",
          // "Sort by first",
          // "Sort by latest",
          "Ordenar por: popularidad",
          "Odernar por precio:bajo a alto"

        ]

        this.sortValues = [

          "high",
          // "first",
          // "latest",
          "popularity",
          "low"

        ]


      }

      /*=============================================
      Filtramos solo hasta 10 productos
      =============================================*/
      // console.log("get_products:",getProducts);
      getProducts.forEach((product, index) => {

        /*=============================================
        Evaluamos si viene número de página definida
        =============================================*/

        if (this.page == undefined) {

          this.page = 1;
        }

        /*=============================================
        Configuramos la paginación desde - hasta
        =============================================*/

        let first = Number(index) + (this.page * 6) - 6;
        let last = 6 * this.page;

        /*=============================================
        Filtramos los productos a mostrar
        =============================================*/

        if (first < last) {

          if (getProducts[first] != undefined) {

            this.products.push(getProducts[first]);

            this.rating.push(DinamicRating.fnc(getProducts[first]));

            this.reviews.push(DinamicReviews.fnc(this.rating[index]));

            this.price.push(DinamicPrice.fnc(getProducts[first]));

            this.cargando = false;

          }
        }

      })
    }else{
      this.cargando = false;
    }


  }

  /*=============================================
Función que nos avisa cuando finaliza el renderizado de Angular
=============================================*/

  callback(params) {

    if (this.render) {

      this.render = false;

      Rating.fnc();
      Pagination.fnc();
      Select2Cofig.fnc();
      Tabs.fnc();

      /*=============================================
    Captura del Select Sort Items
    =============================================*/

      $(".sortItems").change(function () {

        window.open(`search/${params}&${$(this).val()}`, '_top')

      })
    }
  }

  addWishList(producto){
    this.userService.wishlist(producto);
  }

}
