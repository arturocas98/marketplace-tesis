import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cuenta-mis-compras',
  templateUrl: './cuenta-mis-compras.component.html',
  styleUrls: ['./cuenta-mis-compras.component.css']
})
export class CuentaMisComprasComponent implements OnInit,OnDestroy {
  @Input() usuario: string;
  path: string = environment.url_image;
  myShopping: any[] = [];
  process: any[] = [];
  es_vendedor:boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private ordersService: OrdenesService,
    private tiendaService: TiendaService,
  ) { }

  ngOnInit(): void {
    console.log("usuario:",this.usuario);
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

    this.tiendaService.getFilterData("username",this.usuario).subscribe(respTienda=>{
      if (Object.keys(respTienda).length > 0) {
        this.es_vendedor = true;
      }
    });
    this.ordersService.getFilterData("usuario", this.usuario)
      .subscribe(resp => {

        let load = 0;

        for (const i in resp) {

          load++

          this.myShopping.push(resp[i]);
          this.process.push(JSON.parse(resp[i]["proceso"]));

        }
        /*=============================================
        Pintar el render en DataTable
        =============================================*/

        if (load == this.myShopping.length) {

          this.dtTrigger.next();

        }

      })

  }

  /*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();
	}

}
