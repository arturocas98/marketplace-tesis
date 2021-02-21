import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DisputaService } from 'src/app/core/disputa/disputa.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Disputa } from 'src/app/models/disputa';
import { environment } from 'src/environments/environment';
import { Sweetalert } from '../../../functions';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-cuenta-disputas',
  templateUrl: './cuenta-disputas.component.html',
  styleUrls: ['./cuenta-disputas.component.css']
})
export class CuentaDisputasComponent implements OnInit {
  @Input() childItem: any;

  disputes: any[] = [];
  idDisputes: any[] = [];
  idDispute: string;
  dispute: Disputa;
  email: string = environment.email;
  userDispute: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private disputesService: DisputaService,
    private usersService: UsuarioService,
    private http: HttpClient) {

    this.dispute = new Disputa();

  }

  ngOnInit(): void {

    /*=============================================
    Agregamos opciones a DataTable
    =============================================*/

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    }

    let load = 0;

    /*=============================================
  Preguntamos si esta tienda tiene disputas
  =============================================*/

    this.disputesService.getFilterData("receptor", this.childItem)
      .subscribe(resp => {

        if (Object.keys(resp).length > 0) {

          for (const i in resp) {

            load++;

            this.disputes.push(resp[i]);
            this.idDisputes.push(i);

            /*=============================================
                      Traemos el usuario de la disputa
                      =============================================*/
            this.usersService.getFilterData("username", resp[i].emisor)
              .subscribe(resp => {

                if (Object.keys(resp).length > 0) {

                  for (const i in resp) {

                    this.userDispute.push(resp[i]);

                  }

                }

              })
          }

        }

        if (load == this.disputes.length) {

          this.dtTrigger.next();
        }
      })


  }

  /*=============================================
  Responder Disputa
  =============================================*/

  answerDispute(idDispute) {

    this.idDispute = idDispute;

    /*=============================================
     Abrir la ventana modal
     =============================================*/

    $("#answerDispute").modal()

  }

  /*=============================================
Formulario respuesta disputas
=============================================*/

  onSubmit(f: NgForm) {

    /*=============================================
    Validamos formulario para evitar campos vacíos
    =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Invalid Request", null);

      return;

    }

    /*=============================================
        Actualizamos la disputa en la BD
        =============================================*/

    let body = {

      fecha_respuesta: new Date(),
      respuesta: this.dispute.respuesta

    }

    this.disputesService.patchDataAuth(this.idDispute, body, localStorage.getItem("idToken"))
      .subscribe(resp => {

        if (resp["name"] != "") {

          /*=============================================
                Enviar notificación por correo electrónico
                =============================================*/
          const formData = new FormData();

          formData.append('email', 'yes');
          formData.append('comment', 'Ha recibido una actualización sobre el proceso de entrega de su disputa');
          formData.append('url', 'cuenta-usuario/cuenta/mis-compras');
          formData.append('address', this.userDispute[0].email);
          formData.append('name', this.userDispute[0].username);

          this.http.post(this.email, formData)
            .subscribe(resp => {

              if (resp["status"] == 200) {

                Sweetalert.fnc("success", "La disputa ha sido respondida", "cuenta-usuario/cuenta/disputas");

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
