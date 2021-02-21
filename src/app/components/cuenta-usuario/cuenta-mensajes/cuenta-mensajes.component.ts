import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MensajeService } from 'src/app/core/mensaje/mensaje.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Mensaje } from 'src/app/models/mensaje';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Sweetalert } from '../../../functions';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-cuenta-mensajes',
  templateUrl: './cuenta-mensajes.component.html',
  styleUrls: ['./cuenta-mensajes.component.css']
})
export class CuentaMensajesComponent implements OnInit, OnDestroy {
  @Input() childItem: any;

  path: string = environment.url_image;

  messages: any[] = [];
  idMessage: any[] = [];
  message: Mensaje;
  uniqueIdMessage: string;
  userMessage: any[] = [];
  email: string = environment.email;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private messagesService: MensajeService,
    private usersService: UsuarioService,
    private http: HttpClient) {

    this.message = new Mensaje();

  }

  ngOnInit(): void {

    /*=============================================
      Agregamos opciones a DataTable
      =============================================*/

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

    let load = 0;

    /*=============================================
  Preguntamos si esta tienda tiene mensajes
  =============================================*/

    this.messagesService.getFilterData("receptor", this.childItem)
      .subscribe(resp => {

        if (Object.keys(resp).length > 0) {

          for (const i in resp) {

            load++;

            this.messages.push(resp[i]);

            this.idMessage.push(i);

            /*=============================================
                      Traemos el usuario del mensaje
                      =============================================*/

            this.usersService.getFilterData("username", resp[i].emisor)
              .subscribe(resp => {

                if (Object.keys(resp).length > 0) {

                  for (const i in resp) {

                    this.userMessage.push(resp[i]);

                  }

                }

              })

          }

        }

        if (load == this.messages.length) {

          this.dtTrigger.next();
        }
      })
  }

  /*=============================================
    Responder message
    =============================================*/

  answerMessage(idMessage) {

    this.uniqueIdMessage = idMessage;

    /*=============================================
    Abrir la ventana modal
    =============================================*/

    $("#answerMessage").modal()

  }


  /*=============================================
  Formulario respuesta disputas
  =============================================*/

  onSubmit(f: NgForm) {


    /*=============================================
      Validamos formulario para evitar campos vacíos
      =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Rellene los campos requeridos", null);

      return;

    }

    /*=============================================
      Actualizamos el mensaje en la BD
      =============================================*/

    let body = {

      fecha_respuesta: new Date(),
      respuesta: this.message.respuesta

    }

    this.messagesService.patchDataAuth(this.uniqueIdMessage, body, localStorage.getItem("idToken"))
      .subscribe(resp => {

        if (resp["name"] != "") {

          /*=============================================
          Enviar notificación por correo electrónico
          =============================================*/

          const formData = new FormData();

          formData.append('email', 'yes');
          formData.append('comment', 'Ha recibido una actualización sobre su proceso de entrega de mensajes');
          formData.append('url', 'producto/' + this.messages["url_producto"]);
          formData.append('address', this.userMessage[0].email);
          formData.append('name', this.userMessage[0].username);

          this.http.post(this.email, formData)
            .subscribe(resp => {

              if (resp["status"] == 200) {

                Sweetalert.fnc("success", "El mensaje ha sido respondido", "cuenta-usuario/cuenta/mensajes");

              }

            })
        }

      }, err => {

        Sweetalert.fnc("error", err.error.error.message, null)

      })

  }

  /*=============================================
  Destruímos el trigger de angular
  =============================================*/

  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();

  }

}
