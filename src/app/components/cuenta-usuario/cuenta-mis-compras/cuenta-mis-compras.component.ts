import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DisputaService } from 'src/app/core/disputa/disputa.service';
import { OrdenService } from 'src/app/core/orden/orden.service';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Disputa } from 'src/app/models/disputa';
import { environment } from 'src/environments/environment';
import { Sweetalert, Rating } from '../../../functions';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cuenta-mis-compras',
  templateUrl: './cuenta-mis-compras.component.html',
  styleUrls: ['./cuenta-mis-compras.component.css']
})
export class CuentaMisComprasComponent implements OnInit, OnDestroy {
  @Input() usuario: string;
  path: string = environment.url_image;
  myShopping: any[] = [];
  process: any[] = [];
  es_vendedor: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  id_order: any[] = [];
  dispute: Disputa;
  disputes: any[] = [];
  reviews: any[] = [];
  username: string;
  picture: string;
  method: string;
  idProduct: string;
  render: boolean = false;
  ordenes: any[] = [];
  id_orden: any[] = [];
  id_orden_modal: any;
  constructor(
    private ordersService: OrdenesService,
    private ordenService: OrdenService,
    private tiendaService: TiendaService,
    private disputesService: DisputaService,
    private usersService: UsuarioService,
    private productsService: ProductoService
  ) {
    this.dispute = new Disputa();
  }

  ngOnInit(): void {
    console.log("usuario:", this.usuario);
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
      if (Object.keys(respTienda).length > 0) {
        this.es_vendedor = true;
      }
    });

    this.ordenService.getFilterData("usuario", this.usuario).subscribe(respOrden => {
      // let id_orders = ;
      if (Object.keys(respOrden).length > 0) {
        let load = 0;

        for (const j in respOrden) {
          load++
          this.ordenes.push(respOrden[j]);
          this.id_orden.push(j);
        }


        /*=============================================
           Pintar el render en DataTable
           =============================================*/
        if (load == this.ordenes.length) {

          this.dtTrigger.next();

        }

        Rating.fnc();
      }






    });





  }

  /*=============================================
  Función nueva disputa
  =============================================*/
  newDispute(id_order, store, user) {

    this.dispute.orden = id_order;
    this.dispute.receptor = store;
    this.dispute.emisor = user;
    this.dispute.fecha_disputa = new Date();

    /*=============================================
        Abrir la ventana modal
        =============================================*/
    $("#newDispute").modal()

  }
  abrirProceso(id_order) {
    this.id_orden_modal = id_order;
    if (this.ordenes.length > 0) {
      this.ordersService.getFilterData("id_orden", id_order).subscribe(resp => {

        console.log("respuesta de ordenes:", resp);

        for (const i in resp) {

          this.usersService.getFilterData("username", resp[i].emisor).subscribe(resp1 => {

            this.myShopping.push(resp[i]);
            this.process.push(JSON.parse(resp[i]["proceso"]));
            this.id_order.push(i);

            /*=============================================
            Traemos las disputas
            =============================================*/

            this.id_order.forEach(order => {

              this.disputesService.getFilterData("orden", order)
                .subscribe(resp => {
                  // let tamanio = Object.keys(resp).length;
                  // console.log("disputas:", resp);
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

                      this.usersService.getFilterData("username", resp[i].emisor)
                        .subscribe(resp1 => {

                          for (const f in resp1) {

                            resp[i].user = resp1[f];
                          }


                        })
                      console.log("disputas:", this.disputes);
                      let localDisputes = this.disputes;

                      setTimeout(function () {

                        localDisputes.push(resp[i]);

                      }, count * 1000)


                    }

                  }


                })

            })



            /*=============================================
            Traemos las reseñas del producto
            =============================================*/

            this.productsService.getFilterDataMyStore("url", resp[i].url)
              .subscribe(resp => {

                for (const i in resp) {

                  this.reviews.push(JSON.parse(resp[i].reviews));

                }


              })

          });
        }
      });





    }

    /*=============================================
        Abrir la ventana modal
        =============================================*/
    $("#proceso").modal()

  }

  /*=============================================
  Formulario disputas
  =============================================*/

  onSubmit(f: NgForm) {

    /*=============================================
      Validamos formulario para evitar campos vacíos
      =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;

    }

    /*=============================================
        Crear una disputa en la BD
        =============================================*/

    this.disputesService.registerDatabase(this.dispute, localStorage.getItem("idToken"))
      .subscribe(resp => {

        if (resp["name"] != "") {

          Sweetalert.fnc("success", "La disputa fue creada correctamente", "cuenta-usuario/cuenta/mis-compras");
        }

      }, err => {

        Sweetalert.fnc("error", err.error.error.message, null)

      })

  }

  /*=============================================
  Función nueva reseña
  =============================================*/

  newReview(user, url) {

    /*=============================================
    Almaceno el usuario
    =============================================*/

    this.username = user;

    /*=============================================
    Traemos el producto para capturar su ID
    =============================================*/

    this.usersService.getFilterData("username", user)
      .subscribe(resp => {

        for (const i in resp) {

          this.picture = resp[i].imagen;
          this.method = resp[i].metodo_registro;
        }

      });

    /*=============================================
    Traemos el producto para capturar su ID
    =============================================*/

    this.productsService.getFilterDataMyStore("url", url)
      .subscribe(resp => {

        this.idProduct = Object.keys(resp)[0];

      });

    /*=============================================
        Abrir la ventana modal
        =============================================*/

    $("#newReview").modal()


  }

  /*=============================================
  Enviar nueva reseña
  =============================================*/

  submitReview(comment, review) {

    /*=============================================
    Validar que la reseña no venga vacía
    =============================================*/

    if (review.value == "" || comment.value == "") {

      Sweetalert.fnc("error", "Invalid Request", null);

      return;

    }

    /*=============================================
    Crear el cuerpo de la reseña
    =============================================*/

    let body = [{

      "review": review.value,
      "comentario": comment.value,
      "nombre": this.username,
      "imagen": this.picture,
      "metodo": this.method

    }];

    /*=============================================
    Traer las reseñas del producto
    =============================================*/

    this.productsService.getById(this.idProduct)
      .subscribe(resp => {

        let reviews = JSON.parse(resp["reviews"]);

        /*=============================================
        Eliminar la reseña creada por el usuario anteriormente
        =============================================*/

        reviews.forEach((review, index) => {

          if (review.name == this.username) {

            reviews.splice(index, 1);

          }

        })

        /*=============================================
        Actualizar la información de las reseñas
        =============================================*/

        reviews.forEach(review => {

          body.push(review);

        })

        /*=============================================
        Actualizar las reseñas del producto
        =============================================*/

        let value = {

          "reviews": JSON.stringify(body)
        }

        this.productsService.patchData(this.idProduct, value)
          .subscribe(resp => {

            if (resp["reviews"] != "") {

              Sweetalert.fnc("success", "La reseña fue creada correctamente", "cuenta-usuario/cuenta/mis-compras");
            }

          }, err => {

            Sweetalert.fnc("error", err.error.error.message, null)

          })

      })

  }

  callback(iReview) {

    if (!this.render) {

      this.render = true;

      setTimeout(function () {

        let reviews = $("[reviews]");

        for (let i = 0; i < reviews.length; i++) {

          for (let r = 0; r < 5; r++) {

            $(reviews[i]).append(`
							
							<option value="2">${r + 1}</option>

			        	`)

            if ($(reviews[i]).attr("reviews") == (r + 1)) {

              $(reviews[i]).children("option").val(1)
            }
          }

        }

        Rating.fnc();

      }, 100 * (iReview + 1))
    }

  }

  /*=============================================
  Destruímos el trigger de angular
  =============================================*/

  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();
  }

}
