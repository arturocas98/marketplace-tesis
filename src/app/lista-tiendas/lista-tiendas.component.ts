import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TiendaService } from '../core/tienda/tienda.service';
import {  Select2Cofig, Pagination } from '../functions';

@Component({
  selector: 'app-lista-tiendas',
  templateUrl: './lista-tiendas.component.html',
  styleUrls: ['./lista-tiendas.component.css']
})
export class ListaTiendasComponent implements OnInit {

  path: string = environment.url_image;

  stores: any[] = [];
  storeFound: number = 0;
  totalPage: number = 0;
  page: number = 1;
  param1: any = null;
  param2: any = null;
  render: boolean = true;
  sortItems: any[] = [];
  sortValues: any[] = [];
  currentRoute: string = "lista-tiendas";

  constructor(private storesService: TiendaService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    /*=============================================
    Capturamos el parámetro URL
    =============================================*/

    if (this.activatedRoute.snapshot.params["param"] != undefined) {

      this.param1 = this.activatedRoute.snapshot.params["param"].split("&")[0];
      this.param2 = this.activatedRoute.snapshot.params["param"].split("&")[1];

    }

    if (Number(this.param1)) {

      this.page = this.param1;

      this.currentRoute = `lista-tiendas/${this.page}`;

    }

    /*=============================================
    Traemos todas las tiendas del marketplace
    =============================================*/

    this.storesService.getData()
      .subscribe(resp => {

        this.storeFnc(resp);

      })



  }


  /*=============================================
Declaramos función para mostrar el catálogo de tiendas
=============================================*/

  storeFnc(response) {

    this.stores = [];

    let getStores = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    for (const i in response) {

      getStores.push(response[i]);
    }

    /*=============================================
    Filtramos de acuerdo a la búsqueda
    =============================================*/

    if (this.param2 != null) {

      getStores = getStores.filter(value => !value.tienda.search(this.param2));

    }

    /*=============================================
    Filtramos de acuerdo al orden
    =============================================*/

    if (this.param1 == null) {

      getStores.sort((a, b) => {
        return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      })

      this.sortItems = [

        "Ordenar por más reciente: antiguo a noticias",
        "Ordenar por más antiguo: nuevo a antiguo"

      ]

      this.sortValues = [

        "first",
        "latest"

      ]

    }

    if (this.param1 != null && this.param1 == "latest") {

      getStores.sort((a, b) => {
        return new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      })

      this.sortItems = [

        "Ordenar por más antiguo: nuevo a antiguo",
        "Ordenar por más reciente: antiguo a nuevo"
      ]

      this.sortValues = [

        "latest",
        "first"
      ]

    }

    if (this.param1 != null && this.param1 == "first") {

      getStores.sort((a, b) => {
        return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      })

      this.sortItems = [

        "Ordenar por más antiguo: nuevo a antiguo",
        "Ordenar por más reciente: antiguo a noticias"

      ]

      this.sortValues = [

        "first",
        "latest"

      ]

    }

    /*=============================================
    Definimos el total de tiendas y la paginación de tiendas
    =============================================*/

    this.storeFound = getStores.length;

    this.totalPage = Math.ceil(Number(this.storeFound) / 9);

    /*=============================================
    Filtramos solo hasta 9 tiendas
    =============================================*/

    getStores.forEach((product, index) => {


      /*=============================================
      Configuramos la paginación desde - hasta
      =============================================*/

      let first = Number(index) + (this.page * 9) - 9;

      let last = 9 * this.page;

      /*=============================================
      Filtramos los productos a mostrar
      =============================================*/

      if (first < last) {

        if (getStores[first] != undefined) {

          this.stores.push(getStores[index]);

        }

      }

    })



  }

  /*=============================================
  Función para el buscador de tiendas
  =============================================*/


  searchStore(search) {

    window.open(`lista-tiendas/search&${search.value}`, '_top');

  }

  /*=============================================
  Función que nos avisa cuando finaliza el renderizado de Angular
  =============================================*/

  callback() {

    if (this.render) {

      this.render = false;
      Select2Cofig.fnc();
      Pagination.fnc();

      $(".sortItems").change(function () {

        window.open(`lista-tiendas/${$(this).val()}`, '_top');

      })


    }

  }

}
