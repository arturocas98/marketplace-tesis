import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { VentaService } from 'src/app/core/venta/venta.service';
import { environment } from 'src/environments/environment';
import { OwlCarouselConfig, CountDown, ProductLightbox, carouselNavigation, SlickConfig, Rating, ProgressBar } from '../../../functions';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {
  public url_image: string;
  public getProducts: Array<any>;
  public products: Array<any>;
  public now: Date;
  public fecha_oferta;
  public indexes: Array<any>;
  public render: boolean;
  public render_bestseller: boolean;
  public preload: boolean;
  public topSalesBlock: any[] = [];
  public topSales: any[] = [];

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService
  ) {
    this.url_image = environment.url_image;
    this.getProducts = [];
    this.now = new Date();
    this.fecha_oferta = null;
    this.indexes = [];
    this.render = true;
    this.products = [];
    this.preload = false;
    this.render_bestseller = true;
  }

  ngOnInit(): void {
    this.preload = true;
    this.getProductos();
    this.getVentas();
  }
  getProductos() {
    this.productoService.getAll().subscribe(res => {
      // console.log(res);
      let i;
      for (const i in res) {

        this.getProducts.push(
          {
            "offer": JSON.parse(res[i].offer),
            "stock": res[i].stock
          }

        )
        this.products.push(res[i]);

      }

      for (const i in this.getProducts) {
        this.fecha_oferta = new Date(
          parseInt(this.getProducts[i]['offer'][2].split("-")[0]),
          parseInt(this.getProducts[i]['offer'][2].split("-")[1]) - 1,
          parseInt(this.getProducts[i]['offer'][2].split("-")[2]),

        )
        if (this.now < this.fecha_oferta && this.getProducts[i]["stock"] > 0) {
          this.indexes.push(i);
          this.preload = false;
        }

      }

    })
  }


  getVentas() {
    /*=============================================
    Tomamos la data de las ventas
    =============================================*/

    let getSales = [];

    this.ventaService.getAll()
      .subscribe(resp => {

        /*=============================================
        Recorremos cada venta para separar los productos y las cantidades
        =============================================*/

        let i;

        for (i in resp) {

          getSales.push({

            "producto": resp[i].producto,
            "cantidad": resp[i].cantidad

          })

        }

        /*=============================================
        Ordenamos de mayor a menor el arreglo de objetos
        =============================================*/

        getSales.sort(function (a, b) {

          return (b.cantidad - a.cantidad)

        })

        /*=============================================
        Sacamos del arreglo los productos repetidos dejando los de mayor venta
        =============================================*/

        let ventas_filter = [];
        getSales.forEach(sale => {

          if (!ventas_filter.find(resp => resp.producto == sale.producto)) {

            const { producto, cantidad } = sale;

            ventas_filter.push({ producto, cantidad })

          }

        })

        console.log("ventas_filter:", ventas_filter);

        /*=============================================
        Filtramos la data de productos buscando coincidencias con las ventas
        =============================================*/

        let block = 0;

        ventas_filter.forEach((sale, index) => {

          /*=============================================
          Filtramos hasta 20 ventas
          =============================================*/

          if (index < 20) {

            block++;
            this.productoService.getByFilter("name", sale.producto)
              .subscribe(resp => {
                let i;

                for (i in resp) {

                  this.topSales.push(resp[i])


                }


              })

          }

        })

        /*=============================================
         Enviamos el máximo de bloques para mostrar 4 productos por bloque
         =============================================*/
        let count = 0;

        for (let i = 0; i < Math.round(15/ 4); i++) {

          count++;

          this.topSalesBlock.push(i);

        }
        console.log("this.topSalesBlock",this.topSalesBlock);
        if (count == this.topSalesBlock.length) {

          this.topSalesBlock.pop();
        }

        console.log("block", block);

      })
  }


  callbackBestSeller(topSales) {

    if (this.render_bestseller) {

      this.render_bestseller = false;

      /*=============================================
      Capturamos la cantidad de bloques que existe en el DOM
      =============================================*/
      let topSaleBlock = $(".topSaleBlock");
      let top20Array = [];

      /*=============================================
      Ejecutamos en SetTimeOut - por cada bloque un segundo de espera
      =============================================*/

      setTimeout(function () {

        /*=============================================
        Removemos el preload
        =============================================*/

        $(".preload").remove();

        /*=============================================
        Hacemos un ciclo por la cantidad de bloques
        =============================================*/

        for (let i = 0; i < topSaleBlock.length; i++) {



          /*=============================================
          Agrupamos la cantidad de 4 productos por bloque
          =============================================*/

          top20Array.push(

            topSales.slice(i * topSaleBlock.length, (i * topSaleBlock.length) + topSaleBlock.length)

          )
          /*=============================================
          Hacemos un recorrido por el nuevo array de objetos
          =============================================*/

          let f;

          for (f in top20Array[i]) {

            /*=============================================
            Definimos si el precio del producto tiene oferta o no
            =============================================*/

            let price;
            let type;
            let value;
            let offer;

            if (top20Array[i][f].offer != "") {

              type = JSON.parse(top20Array[i][f].offer)[0];
              value = JSON.parse(top20Array[i][f].offer)[1];

              if (type == "Descuento") {

                offer = (top20Array[i][f].price - (top20Array[i][f].price * value / 100)).toFixed(2)

              }

              if (type == "Fijo") {

                offer = value

              }

              price = `<p class="ps-product__price sale">$${offer} <del>$${top20Array[i][f].price} </del></p>`;

            } else {

              price = `<p class="ps-product__price">$${top20Array[i][f].price} </p>`;

            }

            /*=============================================
            Adicionar a la vista los productos clasificados
            =============================================*/

            $(topSaleBlock[i]).append(`

						  <div class="ps-product--horizontal" style="z-index:10000">

                <div class="ps-product__thumbnail">
                  <a href="product/${top20Array[i][f].url}">
                    <img src="assets/img/products/categorias/${top20Array[i][f].category}/${top20Array[i][f].image}">
                  </a>
                </div>

                <div class="ps-product__content">

                  <a class="ps-product__title" href="product/${top20Array[i][f].url}">${top20Array[i][f].name}</a>

                    ${price}

                </div>

              </div>

						`)

          }

        }

        /*=============================================
        Modificamos el estilo del plugin OWL Carousel
        =============================================*/
        $(".owl-dots").css({ "bottom": "0" })
        $(".owl-dot").css({ "background": "#ddd" })

      }, topSaleBlock.length * 1000)

    }

  }

  callback() {
    if (this.render) {
      this.render = false;


      let galleryMix_1 = $(".galleryMix_1");
      let galleryMix_2 = $(".galleryMix_2");
      let galleryMix_3 = $(".galleryMix_3");

      let review_1 = $(".review_1");
      let review_2 = $(".review_2");
      let review_3 = $(".review_3");

      let offer_1 = $(".offer_1");
      let offer_2 = $(".offer_2");
      let offer_3 = $(".offer_3");

      //recorremos todos los productos cumpla la condicion de hot today
      for (let i = 0; i < galleryMix_1.length; i++) {
        // recorremos las fotografias de la galeria de cada producto
        for (let j = 0; j < JSON.parse($(galleryMix_1[i]).attr("gallery")).length; j++) {
          $(galleryMix_2[i]).append(
            `<div class="item" >
              <a href="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" >
                <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" alt = "" >
              </a>
            </div>`



          )
          $(galleryMix_3[i]).append(
            ` <div class="item">
              <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" alt="">
            </div>`
          )

        }

        let offer = JSON.parse($(offer_1[i]).attr("offer"));
        let price = JSON.parse($(offer_1[i]).attr("price"));
        if (offer[0] == 'Descuento') {
          $(offer_1[i]).html(

            `<span>Save <br> $${(price * offer[1] / 100).toFixed(2)}</span>`

          )

          $(offer_2[i]).html(`$${(price - (price * offer[1] / 100)).toFixed(2)}`)
        }

        if (offer[0] == "Fijo") {

          $(offer_1[i]).html(

            `<span>Save <br> $${(price - offer[1]).toFixed(2)}</span>`

          )

          $(offer_2[i]).html(`$${offer[1]}`)

        }

        $(offer_3[i]).attr("data-time",

          new Date(

            parseInt(offer[2].split("-")[0]),
            parseInt(offer[2].split("-")[1]) - 1,
            parseInt(offer[2].split("-")[2])

          )

        )



        let total_review = 0;
        // for (let i = 0; i < JSON.parse($(review_1[i]).attr("reviews")).length; i++) {
        //   total_review += Number(JSON.parse($(review_1[i]).attr("reviews"))[i]['review']);
        // }
        for (let f = 0; f < JSON.parse($(review_1[i]).attr("reviews")).length; f++) {

          total_review += Number(JSON.parse($(review_1[i]).attr("reviews"))[f]["review"])

        }

        /*=============================================
        Imprimimos el total de las calificaciones para cada producto
        =============================================*/

        let rating = Math.round(total_review / JSON.parse($(review_1[i]).attr("reviews")).length);

        $(review_3[i]).html(rating);


        for (let f = 1; f <= 5; f++) {

          $(review_2[i]).append(

            `<option value="2">${f}</option>`
          )

          if (rating == f) {

            $(review_2[i]).children('option').val(1)

          }
        }

        // console.log(total_review);
      }
      // OwlCarouselConfig.fnc();
      carouselNavigation.fnc();
      SlickConfig.fnc();
      ProductLightbox.fnc();
      CountDown.fnc();
      Rating.fnc();
      ProgressBar.fnc();
    }
  }

}
