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
      processing: true
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
