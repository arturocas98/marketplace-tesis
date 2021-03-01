import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Datepicker, ChartJs, ChartJsPie } from '../functions';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../core/ordenes/ordenes.service';
import { UsuarioService } from '../core/usuario/usuario.service';
import { VentaService } from '../core/venta/venta.service';
import { ProductoService } from '../core/producto/producto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Comisiones del mes', cols: 1, rows: 1 },
          { title: 'Ventas por tienda', cols: 1, rows: 1 },
          { title: 'Categorias más vistas', cols: 1, rows: 1 },
          { title: 'Subcategorias más vistas', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Comisiones del mes', cols: 2, rows: 1 },
        { title: 'Ventas por tienda', cols: 1, rows: 1 },
        { title: 'Categorias más vistas', cols: 1, rows: 2 },
        { title: 'Subcategorias más vistas', cols: 1, rows: 1 }
      ];
    })
  );

  dataDate: any[] = [];
  dataProfit: any[] = [];
  dateFrom: any = null;
  dateTo: any = null;
  sales: any[] = [];
  usuarios :any[] =[];
  productos:number = 0;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdenesService,
    private salesService: VentaService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    console.log("activatedRoute:",this.activatedRoute.snapshot);
    
    // this.dateFrom = this.activatedRoute.snapshot.params["param"].split("&")[1];
    // this.dateTo = this.activatedRoute.snapshot.params["param"].split("&")[2];

    let config = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March'],
        datasets: [{
          label: 'Comisiones',
          backgroundColor: 'rgba(0,255,255,.2)',
          borderColor: '#0cf',
          data: [10, 50, 40],
          fill: true,
        }]
      },
      options: {
        responsive: true,
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       min: 0,
        //       max: Math.ceil(max / 1000) * 1000
        //     }
        //   }]
        // }
      }
    };

    var configPieChart = {
      type: 'pie',
      data: {
        datasets: [{
          data: ['50', '80', '20'],
          backgroundColor: [
            '#b1cc43',
            '#cc9043',
            '#0099cc',
          ],
          label: 'Dataset 1'
        }],
        labels: ['Alimentos', 'Cuidado personal', 'Snacks']
      },
      options: {
        responsive: true
      }
    };

    ChartJsPie.fnc(configPieChart);

    ChartJs.fnc(config);
    this.getUsuario();
    this.getProductos();
  }


  getVentas() {
    let load = 0;
    /*=============================================
    Preguntamos si esta tienda tiene órdenes
    =============================================*/

    this.ordersService.getAll()
      .subscribe(resp => {
        // console.log("respuesta:",resp);
        if (Object.keys(resp).length > 0) {

          for (const i in resp) {

            /*=============================================
            Traemos las ventas relacionadas a las órdenes
            =============================================*/

            this.salesService.getFilterData("id_order", i).subscribe(resp2 => {
              // console.log("respuesta2:", resp2);

              if (Object.keys(resp2).length > 0) {

                for (const f in resp2) {

                  load++;
                  // console.log("entro for");
                  /*=============================================
                  Agregamos al array principal de órdenes la propiedad "sales"
                  =============================================*/

                  resp[i].sales = resp2[f];

                  /*=============================================
                  Filtramos solo ventas finalizadas
                  =============================================*/

                  if (resp[i].sales.estado == "exitoso") {
                    // console.log("entro if");
                    this.sales.push(resp[i]);
                    // console.log("ventas:", this.sales);
                    /*=============================================
                    Filtramos ventas por fechas
                    =============================================*/

                    if (this.dateFrom != null && this.dateTo != null) {

                      this.sales = this.sales.filter(sale =>

                        sale.sales.fecha_emision.substr(0, 10) >= this.dateFrom &&

                        sale.sales.fecha_emision.substr(0, 10) <= this.dateTo
                      )

                    }

                  }



                }

              }

            })

          }
        }

      })

    Datepicker.fnc();
  }

  getUsuario(){
    this.usuarioService.getAll().subscribe(resp=>{
      for(const i in resp){
        this.usuarios.push(resp[i]);
      }

    });
  }

  getProductos(){
    this.productoService.getAllAdmin().subscribe(resp=>{
      let response = [];
      for(const i in resp){
        response.push(resp[i]);
      }      
      response.map(product=>{
        product.feedback = JSON.parse(product.feedback);
      });
      console.log("respuesta_prod:",resp);
      let resultado = response.filter(p => p.feedback.type == 'review');

      console.log("productos_no_aprobados:",resultado.length);

      this.productos = resultado.length;

    });
  }
}
