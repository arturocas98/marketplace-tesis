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
    // this.function();
  }
  getProductos() {
    this.productoService.getAll().subscribe(res => {
      // console.log(res);
      let i;
      for (const i in res) {

        this.getProducts.push(
          {
            "oferta": JSON.parse(res[i].oferta),
            "stock": res[i].stock
          }

        )
        this.products.push(res[i]);

      }
      console.log("get products:", this.products);
      for (const i in this.getProducts) {
        this.fecha_oferta = new Date(
          parseInt(this.getProducts[i]['oferta'][2].split("-")[0]),
          parseInt(this.getProducts[i]['oferta'][2].split("-")[1]) - 1,
          parseInt(this.getProducts[i]['oferta'][2].split("-")[2]),

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

        let filterSales = [];

        getSales.forEach(sale => {

          if (!filterSales.find(resp => resp.producto == sale.producto)) {

            const { producto, cantidad } = sale;

            filterSales.push({ producto, cantidad })

          }

        })

        /*=============================================
        Filtramos la data de productos buscando coincidencias con las ventas
        =============================================*/

        let block = 0;

        filterSales.forEach((sale, index) => {

          /*=============================================
          Filtramos hasta 20 ventas
          =============================================*/

          if (index < 20) {

            block++;

            this.productoService.getByFilter("nombre", sale.producto)
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
        // cambiar
        // Math.ceil(block/4)
        for (let i = 0; i < Math.ceil(10 / 4); i++) {

          this.topSalesBlock.push(i);

        }

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

            let precio;
            let type;
            let value;
            let oferta;
            let offerDate;
            let today = new Date();

            if (top20Array[i][f].oferta != "") {

              offerDate = new Date(

                parseInt(JSON.parse(top20Array[i][f].oferta)[2].split("-")[0]),
                parseInt(JSON.parse(top20Array[i][f].oferta)[2].split("-")[1]) - 1,
                parseInt(JSON.parse(top20Array[i][f].oferta)[2].split("-")[2])

              )
              if (today < offerDate) {
                type = JSON.parse(top20Array[i][f].oferta)[0];
                value = JSON.parse(top20Array[i][f].oferta)[1];
  
                if (type == "Descuento") {
  
                  oferta = (top20Array[i][f].precio - (top20Array[i][f].precio * value / 100)).toFixed(2)
  
                }
  
                if (type == "Fijo") {
  
                  oferta = value
  
                }
  
                precio = `<p class="ps-product__price sale">$${oferta} <del>$${top20Array[i][f].precio} </del></p>`;
              }else{
                precio = `<p class="ps-product__price">$${top20Array[i][f].precio} </p>`;
              }
             

            } else {

              precio = `<p class="ps-product__price">$${top20Array[i][f].precio} </p>`;

            }

            /*=============================================
            Adicionar a la vista los productos clasificados
            =============================================*/

            $(topSaleBlock[i]).append(`

						  <div class="ps-product--horizontal" style="z-index:10000">

                <div class="ps-product__thumbnail">
                  <a href="product/${top20Array[i][f].url}">
                    <img src="assets/img/products/categorias/${top20Array[i][f].categoria}/${top20Array[i][f].imagen}">
                  </a>
                </div>

                <div class="ps-product__content">

                  <a class="ps-product__title" href="product/${top20Array[i][f].url}">${top20Array[i][f].nombre}</a>

                    ${precio}

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

      let oferta_1 = $(".oferta_1");
      let oferta_2 = $(".oferta_2");
      let oferta_3 = $(".oferta_3");

      //recorremos todos los productos cumpla la condicion de hot today
      for (let i = 0; i < galleryMix_1.length; i++) {
        // recorremos las fotografias de la galeria de cada producto
        for (let j = 0; j < JSON.parse($(galleryMix_1[i]).attr("galeria")).length; j++) {
          $(galleryMix_2[i]).append(
            `<div class="item" >
              <a href="assets/img/products/categorias/${$(galleryMix_1[i]).attr("categoria")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("galeria"))[j]}" >
                <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("categoria")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("galeria"))[j]}" alt = "" >
              </a>
            </div>`



          )
          $(galleryMix_3[i]).append(
            ` <div class="item">
              <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("categoria")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("galeria"))[j]}" alt="">
            </div>`
          )

        }

        let oferta = JSON.parse($(oferta_1[i]).attr("oferta"));
        let precio = JSON.parse($(oferta_1[i]).attr("precio"));
        if (oferta[0] == 'Descuento') {
          $(oferta_1[i]).html(

            `<span>Save <br> $${(precio * oferta[1] / 100).toFixed(2)}</span>`

          )

          $(oferta_2[i]).html(`$${(precio - (precio * oferta[1] / 100)).toFixed(2)}`)
        }

        if (oferta[0] == "Fijo") {

          $(oferta_1[i]).html(

            `<span>Save <br> $${(precio - oferta[1]).toFixed(2)}</span>`

          )

          $(oferta_2[i]).html(`$${oferta[1]}`)

        }

        $(oferta_3[i]).attr("data-time",

          new Date(

            parseInt(oferta[2].split("-")[0]),
            parseInt(oferta[2].split("-")[1]) - 1,
            parseInt(oferta[2].split("-")[2])

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
      // this.carousel();
      carouselNavigation.fnc();
      SlickConfig.fnc();
      ProductLightbox.fnc();
      CountDown.fnc();
      Rating.fnc();
      ProgressBar.fnc();
    }
  }

  carousel() {
    var target = $('.owl-slider');
    if (target.length > 0) {
      target.each(function () {
        var el = $(this),
          dataAuto = el.data('owl-auto'),
          dataLoop = el.data('owl-loop'),
          dataSpeed = el.data('owl-speed'),
          dataGap = el.data('owl-gap'),
          dataNav = el.data('owl-nav'),
          dataDots = el.data('owl-dots'),
          dataAnimateIn = (el.data('owl-animate-in')) ? el.data('owl-animate-in') : '',
          dataAnimateOut = (el.data('owl-animate-out')) ? el.data('owl-animate-out') : '',
          dataDefaultItem = el.data('owl-item'),
          dataItemXS = el.data('owl-item-xs'),
          dataItemSM = el.data('owl-item-sm'),
          dataItemMD = el.data('owl-item-md'),
          dataItemLG = el.data('owl-item-lg'),
          dataItemXL = el.data('owl-item-xl'),
          dataNavLeft = (el.data('owl-nav-left')) ? el.data('owl-nav-left') : "<i class='icon-chevron-left'></i>",
          dataNavRight = (el.data('owl-nav-right')) ? el.data('owl-nav-right') : "<i class='icon-chevron-right'></i>",
          duration = el.data('owl-duration'),
          datamouseDrag = (el.data('owl-mousedrag') == 'on') ? true : false;
        if (target.children('div, span, a, img, h1, h2, h3, h4, h5, h5').length >= 2) {
          el.owlCarousel({
            animateIn: dataAnimateIn,
            animateOut: dataAnimateOut,
            margin: dataGap,
            autoplay: dataAuto,
            autoplayTimeout: dataSpeed,
            autoplayHoverPause: true,
            loop: dataLoop,
            nav: dataNav,
            mouseDrag: datamouseDrag,
            touchDrag: true,
            autoplaySpeed: duration,
            navSpeed: duration,
            dotsSpeed: duration,
            dragEndSpeed: duration,
            navText: [dataNavLeft, dataNavRight],
            dots: dataDots,
            items: dataDefaultItem,
            responsive: {
              0: {
                items: dataItemXS
              },
              480: {
                items: dataItemSM
              },
              768: {
                items: dataItemMD
              },
              992: {
                items: dataItemLG
              },
              1200: {
                items: dataItemXL
              },
              1680: {
                items: dataDefaultItem
              }
            }
          });
        }

      });
    }
  }

}
