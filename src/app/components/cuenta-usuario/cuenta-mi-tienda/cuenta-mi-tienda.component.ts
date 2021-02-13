import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { DinamicRating, DinamicReviews, Tooltip, Rating, Sweetalert, Capitalize, CreateUrl } from '../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-cuenta-mi-tienda',
  templateUrl: './cuenta-mi-tienda.component.html',
  styleUrls: ['./cuenta-mi-tienda.component.css']
})
export class CuentaMiTiendaComponent implements OnInit, OnDestroy {
  @Input() usuario: string;
  path: string = environment.url_image;
  es_vendedor: boolean = false;
  preload: boolean = false;
  store: Array<any> = [];
  products: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  loadProduct: number = 0;
  render: boolean = false;
  renderReview: boolean = false;
  loadReview: number = 0;
  totalReviews: any[] = [];

  constructor(
    private tiendaService: TiendaService,
    private productsService: ProductoService,
    private usersService: UsuarioService,
    private categoriesService: CategoriaService,
    private subCategoriesService: SubcategoriaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    }
    this.tiendaService.getFilterData("username", this.usuario).subscribe(respTienda => {
      if (Object.keys(respTienda).length == 0) {
        window.open('cuenta-usuario/cuenta/nueva-tienda', '_top')
      } else {
        for (const i in respTienda) {
          this.store.push(respTienda[i]);
        }

        this.store.map((item, index) => {
          item.social = JSON.parse(item.social);

          item.newSocial = [];

          for (const i in item.social) {

            if (item.social[i] != "") {

              item.newSocial.push(i)
            }

            /*=============================================
            Capturamos el destino final de cada red social
            =============================================*/

            // switch(i){

            // 	case "facebook":
            // 	this.social["facebook"] = item.social[i].split("/").pop();
            // 	break;

            // 	case "instagram":
            // 	this.social["instagram"] = item.social[i].split("/").pop();
            // 	break;

            // 	case "twitter":
            // 	this.social["twitter"] = item.social[i].split("/").pop();
            // 	break;

            // 	case "linkedin":
            // 	this.social["linkedin"] = item.social[i].split("/").pop();
            // 	break;

            // 	case "youtube":
            // 	this.social["youtube"] = item.social[i].split("/").pop();
            // 	break;

            // }

          }

          return item;
        });

        console.log("tienda:", this.store);


        this.productsService.getFilterDataStore("tienda", this.store[0].tienda).subscribe(resp => {
          console.log("productos:", resp);
          for (const i in resp) {
            this.products.push(resp[i]);
            this.loadProduct++;
          }

          this.products.map((product, index) => {
            product.feedback = JSON.parse(product.feedback);
            product.galeria = JSON.parse(product.galeria);
            product.horizontal_slider = JSON.parse(product.horizontal_slider);
            product.resumen = JSON.parse(product.resumen);
            product.etiquetas = JSON.parse(product.etiquetas);

            if (product.oferta != '') {
              product.oferta = JSON.parse(product.oferta);
            } else {
              product.oferta = [];
            }
            this.totalReviews.push(JSON.parse(product.reviews));

            let rating = DinamicRating.fnc(product);
            product.reviews = DinamicReviews.fnc(rating);

            return product;

          });
          // console.log("total_review:",this.totalReviews.length);
          if (this.loadProduct == this.products.length) {
            this.dtTrigger.next();
          }
        });

        this.preload = true;
      }
    });
  }

  callback(i, totalReviews) {
    if (!this.render) {
      this.render = true;
      let globalRating = 0;
      let globalReviews = 0;
      setTimeout(function () {
        Tooltip.fnc();
        $("table").animate({ "opacity": 1 });
        $(".preloadTable").animate({ "opacity": 0 });
        /*=============================================
              Agregamos las calificaciones totales de la tienda
              =============================================*/

        totalReviews.forEach((review, index) => {

          globalRating += review.length;

          for (const i in review) {

            globalReviews += review[i].review

          }
        })
        console.log("globalRating:", globalRating);
        console.log("globalReviews:", globalReviews);
        //numero de estrellas del 1 al 5 
        let averageReviews = Math.round(globalReviews / globalRating);
        //Porcentaje de calificación de la tienda del 1 al 100%
        let porcentaje;
        if (globalReviews != 0 && globalRating != 0) {
          porcentaje = Math.round(globalReviews * 100 / (globalRating * 5));

        }else{
          porcentaje = 0;
        }

        /*=============================================
        Pintamos en el HTML el promedio y porcentaje de calificaciones
        =============================================*/
        $(".globalRating").html(globalRating);
        $(".porcentaje").html(porcentaje);
        /*=============================================
        Tomamos el Arreglo del promedio de calificaciones
        =============================================*/
        let averageRating = DinamicReviews.fnc(averageReviews);

        /*=============================================
              Pintamos en el HTML el Select para el plugin Rating
              =============================================*/

        $(".br-theme-fontawesome-stars").html(`

					 <select class="ps-rating reviewsOption" data-read-only="true"></select>

            	`)

        /*=============================================
        Recorremos el arreglo del promedio de calificaciones para pintar los options
        =============================================*/

        for (let i = 0; i < averageRating.length; i++) {

          $(".reviewsOption").append(`

						 <option value="${averageRating[i]}">${i + 1}</option>

            		`)

        }

        /*=============================================
        Ejecutamos la función Rating()
        =============================================*/

        Rating.fnc();

      }, i * 100);
    }
  }

  callbackReview() {

    this.loadReview++


    if (this.loadReview > this.loadProduct) {

      if (!this.renderReview) {

        this.renderReview = true;

        Rating.fnc();

      }

    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
