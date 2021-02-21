import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from 'src/app/core/mensaje/mensaje.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Mensaje } from 'src/app/models/mensaje';
import { environment } from 'src/environments/environment';
import {
  Sweetalert,
  Rating,
  DinamicRating,
  DinamicReviews,
  DinamicPrice,
  CountDown,
  ProgressBar,
  Tabs,
  SlickConfig,
  ProductLightbox,
  Quantity
} from '../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-producto-left',
  templateUrl: './producto-left.component.html',
  styleUrls: ['./producto-left.component.css']
})
export class ProductoLeftComponent implements OnInit {
  path: string = environment.url_image;
  product: Array<any> = [];
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  cargando: Boolean = false;
  render: boolean = true;
  countd: Array<any> = [];
  gallery: Array<any> = [];
  render_gallery: boolean = true;
  video: string = null;
  tags: any[] = [];
  totalReviews: String;
  oferta_valida: boolean = false;
  cantidad: number = 1;
  summary: any[] = [];
  es_vendedor: boolean = false;
  messages: Mensaje;

  email: string = environment.email;

  questions: any[] = [];
  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductoService,
    private userService: UsuarioService,
    private router: Router,
    private tiendaService: TiendaService,
    private messagesService: MensajeService,
    private http: HttpClient
  ) {
    this.messages = new Mensaje();

  }

  ngOnInit(): void {
    this.cargando = true;
    this.userService.getFilterData("idToken", localStorage.getItem('idToken')).subscribe(resp => {
      for (const i in resp) {
        this.tiendaService.getFilterData('username', resp[i].username).subscribe(respTienda => {
          if (Object.keys(respTienda).length > 0) {
            this.es_vendedor = true;
          } else {
            this.es_vendedor = false;
          }
        });
      }
    });
    this.productService.getByFilter("url", this.activateRoute.snapshot.params["param"]).subscribe(resp => {
      console.log("resp:", resp);
      this.productsFnc(resp);
    });

    /*=============================================
    Traer preguntas y respuestas del producto
    =============================================*/
    this.messagesService.getFilterData("url_producto", this.activateRoute.snapshot.params["param"])
      .subscribe(resp => {

        if (Object.keys(resp).length > 0) {

          let count = 0;

          for (const i in resp) {

            count++;

            this.tiendaService.getFilterData("tienda", resp[i].receptor)
              .subscribe(resp1 => {

                for (const f in resp1) {

                  resp[i].store = resp1[f];
                }


              })

            this.userService.getFilterData("username", resp[i].emisor)
              .subscribe(resp1 => {

                for (const f in resp1) {

                  resp[i].user = resp1[f];
                }


              })

            let localQuestions = this.questions;

            setTimeout(function () {

              localQuestions.push(resp[i]);

            }, count * 1000)

          }

        }

      })

  }

  productsFnc(response) {

    this.product = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    let i;
    let getProduct = [];

    for (i in response) {

      getProduct.push(response[i]);

    }


    /*=============================================
    Filtramos solo hasta 10 productos
    =============================================*/

    getProduct.forEach((product, index) => {



      this.product.push(product);

      this.rating.push(DinamicRating.fnc(this.product[index]));

      this.reviews.push(DinamicReviews.fnc(this.rating[index]));

      this.price.push(DinamicPrice.fnc(this.product[index]));

      this.summary.push(JSON.parse(this.product[index].resumen));


      if (this.product[index].oferta != '') {
        let today = new Date();
        let offerDate = new Date(
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[0]),
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[1]) - 1,
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[2]),

        );
        if (today < offerDate) {
          const date = JSON.parse(this.product[index].oferta)[2];
          this.countd.push(
            new Date(
              parseInt(date.split('-')[0]),
              parseInt(date.split('-')[1]) - 1,
              parseInt(date.split('-')[2]),

            )
          );
          this.oferta_valida = true;
        }

      }

      // galeria

      this.gallery.push(JSON.parse(this.product[index].galeria));


      /*=============================================
      Video
      =============================================*/

      // if (JSON.parse(this.product[index].video)[0] == "youtube") {

      //   this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `

      // }

      // if (JSON.parse(this.product[index].video)[0] == "vimeo") {

      //   this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`

      // }
      // this.tags = this.product[index].etiquetas.split(',');
      this.tags = JSON.parse(this.product[index].etiquetas);
      this.totalReviews = JSON.parse(this.product[index]["reviews"]).length;
      this.cargando = false;



    })

  }


  callback() {
    if (this.render) {
      this.render = false;
      Rating.fnc();
      CountDown.fnc();
      ProgressBar.fnc();
      Tabs.fnc();
      Quantity.fnc();
    }
  }

  callbackGallery(i) {
    if (this.render_gallery) {
      this.render_gallery = false;
      $('ps-product__thumbnail').hide();
      setTimeout(function () {
        SlickConfig.fnc();
        ProductLightbox.fnc();
        $('ps-product__thumbnail').show();
      }, i * 100)

    }
  }

  addWishList(producto) {
    this.userService.wishlist(producto);
  }

  changeCantidad(cantidad, unidad, movimiento) {
    let number = 1;
    if (Number(cantidad) > 100) {
      cantidad = 100;
    }
    if (Number(cantidad) < 1) {
      cantidad = 1;
    }

    if (movimiento == 'up' && Number(cantidad) < 100) {
      number = Number(cantidad) + unidad;
    }

    else if (movimiento == 'down' && Number(cantidad) < 100) {
      number = Number(cantidad) - unidad;
    }
    else {
      number = Number(cantidad);
    }

    $('.quantity input ').val(cantidad);
    this.cantidad = number;
  }


  addShoppingCart(producto, unidad, detalles) {
    let url = this.router.url;

    let item = {
      producto: producto,
      unidad: this.cantidad,
      detalles: detalles,
      url: url
    }
    this.userService.addShoppingCart(item)
  }


  buyNow(product, unit, details) {



    /*=============================================
    Agregar producto al carrito de compras
    =============================================*/

    let item = {
      producto: product,
      unidad: unit,
      detalles: details,
      url: 'checkout'
    }

    this.userService.addShoppingCart(item);

  }

  /*=============================================
   Función para crear nueva pregunta
   =============================================*/

  newQuestion(question, url, store) {

    this.messages.mensaje = question.value;
    this.messages.url_producto = url;
    this.messages.receptor = store;
    this.messages.fecha_mensaje = new Date();

    /*=============================================
    Validar si este usuario está autenticado
    =============================================*/

    this.userService.authActivate().then(resp => {

      if (!resp) {

        Sweetalert.fnc("error", "Por favor inicia sesión para enviar tu pregunta", null);

        return;

      } else {

        /*=============================================
        Traer el correo de la tienda
        =============================================*/

        let emailStore = null;

        this.tiendaService.getFilterData("tienda", store)
          .subscribe(resp => {

            for (const i in resp) {

              emailStore = resp[i].email;
            }

          })

        /*=============================================
        Traer la información del usuario
        =============================================*/

        this.userService.getFilterData("idToken", localStorage.getItem("idToken"))
          .subscribe(resp => {

            for (const i in resp) {

              this.messages.emisor = resp[i].username;

              /*=============================================
              Crear el mensaje en la base de datos
              =============================================*/

              this.messagesService.registerDatabase(this.messages, localStorage.getItem("idToken"))
                .subscribe(resp => {

                  if (resp["name"] != "") {

                    /*=============================================
                    Enviar notificación por correo electrónico
                    =============================================*/

                    const formData = new FormData();

                    formData.append('email', 'yes');
                    formData.append('comment', 'Haz recibido un nuevo mensaje');
                    formData.append('url', 'account/messages');
                    formData.append('address', emailStore);
                    formData.append('name', store);

                    this.http.post(this.email, formData)
                      .subscribe(resp => {

                        if (resp["status"] == 200) {

                          Sweetalert.fnc("success", "El mensaje ha sido enviado!", "producto/" + url);

                        }

                      })

                  }

                }, err => {

                  Sweetalert.fnc("error", err.error.error.message, null)

                })
            }

          })

      }

    })

  }




}
