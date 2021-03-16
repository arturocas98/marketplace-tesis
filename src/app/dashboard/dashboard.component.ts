import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Datepicker, ChartJs, ChartJsPie } from '../functions';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../core/ordenes/ordenes.service';
import { UsuarioService } from '../core/usuario/usuario.service';
import { VentaService } from '../core/venta/venta.service';
import { ProductoService } from '../core/producto/producto.service';
import * as moment from 'moment';

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
  tiendaGraph: any[] = [];
  precioGraph: any[] = [];
  dateFrom: any = null;
  dateTo: any = null;
  sales: any[] = [];
  usuarios: any[] = [];
  productos: number = 0;
  graph: any[] = [];
  graphPie: any[] = [];
  today: any;
  last_month: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdenesService,
    private salesService: VentaService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService
  ) {
    this.today = moment().format("YYYY-MM-DD");
    var last_month = moment().subtract(30, 'days');
    this.last_month = last_month.format("YYYY-MM-DD");
    // console.log("today:", this.today);
    // console.log("last_month:", this.last_month);

  }

  ngOnInit() {
    // console.log("activatedRoute:",this.activatedRoute.snapshot.params["param"]);



    if (this.activatedRoute.snapshot.params["param"] != undefined) {
      this.dateFrom = this.activatedRoute.snapshot.params["param"].split("&")[0];
      this.dateTo = this.activatedRoute.snapshot.params["param"].split("&")[1];

    }

    // var configPieChart = {
    //   type: 'pie',
    //   data: {
    //     datasets: [{
    //       data: ['50', '80', '20'],
    //       backgroundColor: [
    //         '#b1cc43',
    //         '#cc9043',
    //         '#0099cc',
    //       ],
    //       label: 'Dataset 1'
    //     }],
    //     labels: ['Cocofit', 'La granola feliz', 'THE GREENEST ME']
    //   },
    //   options: {
    //     responsive: true
    //   }
    // };

    // ChartJsPie.fnc(configPieChart);

    // ChartJs.fnc(config);
    this.getUsuario();
    this.getProductos();
    this.getVentas();
  }


  getVentas() {

    this.salesService.getAll().subscribe(resp => {
      for (const i in resp) {
        if (resp[i].estado == 'exitoso') {
          this.sales.push(resp[i]);
        }
      }


      if (this.dateFrom != null && this.dateTo != null) {

        this.sales = this.sales.filter(sale =>

          sale.fecha_emision.substr(0, 10) >= this.dateFrom &&

          sale.fecha_emision.substr(0, 10) <= this.dateTo
        )

      }
      // console.log("ventas:", this.sales);

      if (this.sales.length > 0) {

        this.sales.forEach((sale, index) => {
          /*=============================================
          Agrupamos los datos que mostraremos en el gráfico
          =============================================*/

          this.graph.push({

            "fecha": sale.fecha_emision.substr(0, 10),
            "comision": sale.comision
          })

          this.graphPie.push({
            "tienda": sale.tienda,
            "precio_unitario": sale.precio_unitario
          });


        })


        // console.log("graph pie:",this.graphPie);


        /*=============================================
        Sumamos ventas realizadas en la misma fecha
        =============================================*/

        let graph = [];
        // console.log("grafico:", this.graph);

        this.graph.reduce((res, value) => {

          if (!res[value.fecha]) {

            res[value.fecha] = { fecha: value.fecha, comision: 0 }
            graph.push(res[value.fecha])

          }

          res[value.fecha].comision += Number(value.comision);

          return res;

        }, {})
        // console.log("graph reduce:", this.graph);

        let graphPie = [];

        this.graphPie.reduce((res, value) => {
          
          
          if (!res[value.tienda]) {
            if (value.tienda != undefined) {
              res[value.tienda] = { tienda: value.tienda, precio_unitario: 0 }
              graphPie.push(res[value.tienda])
            }


          }
          if (res[value.tienda] != undefined) {
            res[value.tienda].precio_unitario += Number(value.precio_unitario);

          }

          return res;
        }, {});

        console.log("graph pie reduce:", graphPie)

        /*=============================================
        Ordenamos el arreglo en fecha de menor a mayor
        =============================================*/

        graph.sort((a, b) => {

          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()

        })

        // graphPie.sort((a, b) => {

        //   return a.cantidad - b.cantidad

        // })

        /*=============================================
        Separamos fecha y precios
        =============================================*/

        graph.forEach((value, index) => {

          this.dataDate[index] = value.fecha;
          this.dataProfit[index] = value.comision.toFixed(2);


        })

        graphPie.forEach((value, index) => {

          if (value.tienda != undefined) {
            // console.log("entro:", index);

            this.tiendaGraph[index] = value.tienda;
            this.precioGraph[index] = value.precio_unitario;
          }

        })
        console.log("tienda:", this.tiendaGraph);
        console.log("precio:", this.precioGraph);
      
        /*=============================================
        Extraer el valor máximo de las ventas
        =============================================*/

        let max = Math.max(...this.dataProfit);

        /*=============================================
        Configuración de Chart JS
        =============================================*/



        let config = {
          type: 'line',
          data: {
            labels: this.dataDate,
            datasets: [{
              label: 'comisión',
              backgroundColor: 'rgba(0,255,255,.2)',
              borderColor: '#0cf',
              data: this.dataProfit,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
          }
        };

        var configPieChart = {
          type: 'pie',
          data: {
            datasets: [{
              data: this.precioGraph,
              backgroundColor: [
                "#7dcea0",
                "#FFA07A",
                "#9370DB",
                '#cc9043',
                '#b1cc43',
                "#FFE4E1",
              ],
              label: 'Dataset 1'
            }],
            labels: this.tiendaGraph
          },
          options: {
            responsive: true
          }
        };


        ChartJsPie.fnc(configPieChart);
        ChartJs.fnc(config);
      }

    });


    Datepicker.fnc();
  }

  getUsuario() {
    this.usuarioService.getAll().subscribe(resp => {
      for (const i in resp) {
        this.usuarios.push(resp[i]);
      }

    });
  }

  getProductos() {
    this.productoService.getAllAdmin().subscribe(resp => {
      let response = [];
      for (const i in resp) {
        response.push(resp[i]);
      }
      response.map(product => {
        product.feedback = JSON.parse(product.feedback);
      });
      // console.log("respuesta_prod:",resp);
      let resultado = response.filter(p => p.feedback.type == 'review');

      // console.log("productos_no_aprobados:",resultado.length);

      this.productos = resultado.length;

    });
  }
}
