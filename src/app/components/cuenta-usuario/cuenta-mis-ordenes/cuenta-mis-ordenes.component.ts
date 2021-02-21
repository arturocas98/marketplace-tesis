import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Sweetalert } from '../../../functions';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { VentaService } from 'src/app/core/venta/venta.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-cuenta-mis-ordenes',
  templateUrl: './cuenta-mis-ordenes.component.html',
  styleUrls: ['./cuenta-mis-ordenes.component.css']
})
export class CuentaMisOrdenesComponent implements OnInit,OnDestroy {
  @Input() childItem: any;
  dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();
  orders: any[] = [];
  idOrders: any[] = [];
  process: any[] = [];
  editNextProcess: any[] = [];
  newNextProcess: any[] = [
    { "stage": "", "status": "", "comment": "", "date": "" },
    { "stage": "", "status": "", "comment": "", "date": "" },
    { "stage": "", "status": "", "comment": "", "date": "" }
  ];
  // email: string = Email.url;

  // comentario
  email:string = environment.email;
  constructor(private ordersService: OrdenesService,
    private salesService: VentaService,
    private http: HttpClient) { }

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
  Preguntamos si esta tienda tiene órdenes
  =============================================*/

    this.ordersService.getFilterData("tienda", this.childItem)
      .subscribe(resp => {

        if (Object.keys(resp).length > 0) {

          for (const i in resp) {

            load++;

            this.orders.push(resp[i]);

            this.idOrders.push(i);

            this.process.push(JSON.parse(resp[i].proceso));

          }
          // console.log("proceso:",this.process);
          

          if (load == this.orders.length) {

            this.dtTrigger.next();

          }

        }

      })

  }

  /*=============================================
    Editar Proceso
    =============================================*/

  nextProcess(idOrder, index) {

    this.editNextProcess = this.process[index];
    console.log("edit next process:",this.process[index]);
    
    /*=============================================
    Abrir la ventana modal
    =============================================*/

    $("#nextProcess").modal()

    /*=============================================
    Agregar el ID de la orden
    =============================================*/

    $("#nextProcess .modal-title span").html(idOrder);
    $("#indexOrder").val(index);

    /*=============================================
    Esconder la edición de entrega si el producto aún no se ha enviado
    =============================================*/

    if (this.editNextProcess[1]["status"] == "pendiente") {

      setTimeout(function () {

        let block = $(".card-header");

        $(block[2]).parent().remove();

      }, this.editNextProcess.length * 10)

    }


  }

  /*=============================================
  Recoger información al cambiar el proceso
  =============================================*/

  changeProcess(type, item, index) {

    console.log("item", item.value);

    this.newNextProcess[index][type] = item.value;

  }

  /*=============================================
  Guardar cambios en el proceso de entrega
  =============================================*/

  onSubmitProcess() {

    let idOrder = $("#nextProcess .modal-title span").html();

    this.editNextProcess.map((item, index) => {

      if (this.newNextProcess[index]["status"] != "") {

        item["status"] = this.newNextProcess[index]["status"];

      }

      if (this.newNextProcess[index]["comment"] != "") {

        item["comment"] = this.newNextProcess[index]["comment"];
      }

      if (this.newNextProcess[index]["date"] != "") {

        item["date"] = this.newNextProcess[index]["date"];

      }

      return item;

    })

    /*=============================================
    Preguntamos si es la última parte del proceso
    =============================================*/

    let status = "";

    if (this.newNextProcess[2]["status"] == "ok") {

      status = "entregado";

      /*=============================================
        Traemos la venta relacionada a la orden
        =============================================*/

      this.salesService.getFilterData("id_order", idOrder)
        .subscribe(resp => {

          let idSale = Object.keys(resp)[0];

          let body = {

            "estado": "exitoso"

          }

          /*=============================================
          Cambiar el estado de la venta
          =============================================*/

          this.salesService.patchDataAuth(idSale, body, localStorage.getItem("idToken"))
            .subscribe(resp => { })

        })

    } else {

      status = "pendiente";
    }

    /*=============================================
      Creamos el cuerpo 
      =============================================*/

    let body = {

      "estado": status,
      "proceso": JSON.stringify(this.editNextProcess)
    }

    /*=============================================
    Editar la orden en la BD
    =============================================*/

    this.ordersService.patchDataAuth(idOrder, body, localStorage.getItem("idToken"))
      .subscribe(resp => {

        /*=============================================
        Enviar notificación por correo electrónico
        =============================================*/

        const formData = new FormData();
        // composer
        formData.append('email', 'yes');
        formData.append('comment', 'Ha recibido una actualización sobre el proceso de entrega de su pedido');
        formData.append('url', 'cuenta-usuario/cuenta/mis-compras');
        formData.append('address', this.orders[$("#indexOrder").val()].email);
        formData.append('name', this.orders[$("#indexOrder").val()].usuario);

        this.http.post(this.email, formData)
          .subscribe(resp => {

            if (resp["status"] == 200) {

              Sweetalert.fnc("success", "El pedido se actualizó correctamente", "/cuenta-usuario/cuenta/mis-ordenes");

            } else {

              Sweetalert.fnc("error", "Error al enviar la notificación por correo electrónico", null);

            }

          })

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
