import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { VentaService } from 'src/app/core/venta/venta.service';
import { Datepicker, ChartJs, ChartJsPie } from '../../../functions';
import * as moment from 'moment';
@Component({
	selector: 'app-cuenta-mis-ventas',
	templateUrl: './cuenta-mis-ventas.component.html',
	styleUrls: ['./cuenta-mis-ventas.component.css']
})
export class CuentaMisVentasComponent implements OnInit, OnDestroy {
	@Input() childItem: any;
	sales: any[] = [];

	storeProfits: number = 0;
	commissions: number = 0;
	totalSales: number = 0;

	graph: any[] = [];

	dataDate: any[] = [];
	dataProfit: any[] = [];

	dateFrom: any = null;
	dateTo: any = null;

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();
	productName: any[] = [];
	cantidadProduct: any[] = [];
	graphPie: any[] = [];
	today: any;
	last_month: any;
	constructor(private ordersService: OrdenesService,
		private salesService: VentaService,
		private activatedRoute: ActivatedRoute
	) {
		this.today = moment().format("YYYY-MM-DD");
		var last_month = moment().subtract(30, 'days');
		this.last_month = last_month.format("YYYY-MM-DD");
		console.log("today:", this.today);
		console.log("last_month:", this.last_month);

	}

	ngOnInit(): void {

		/*=============================================
		Capturamos parámetros URL
		=============================================*/

		this.dateFrom = this.activatedRoute.snapshot.params["param"].split("&")[1];
		this.dateTo = this.activatedRoute.snapshot.params["param"].split("&")[2];

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
				// console.log("respuesta:",resp);
				if (Object.keys(resp).length > 0) {

					for (const i in resp) {

						/*=============================================
						Traemos las ventas relacionadas a las órdenes
						=============================================*/

						this.salesService.getFilterData("id_order", i)
							.subscribe(resp2 => {
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

										

											this.sales.sort(function (a, b) {
												
												
												return (a.sales.fecha_emision.substr(0, 10) - b.sales.fecha_emision.substr(0, 10))
								
											})

											// console.log("ventas sort:" ,this.sales);
											

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

										/*=============================================
										Configuramos información para la vista de ventas
										=============================================*/
										// console.log("load:",load);
										// console.log("respuesta length:",Object.keys(resp).length);
										if (load == Object.keys(resp).length) {
											if (this.sales.length > 0) {

												this.sales.forEach((sale, index) => {

													this.storeProfits += Number(sale.sales.precio_unitario);
													this.commissions += Number(sale.sales.comision);
													this.totalSales += Number(sale.sales.total);


													/*=============================================
													Agrupamos los datos que mostraremos en el gráfico
													=============================================*/

													this.graph.push({

														"date": sale.sales.fecha_emision.substr(0, 10),
														"price": sale.sales.precio_unitario
													})

													this.graphPie.push({
														"producto": sale.sales.producto,
														"cantidad": sale.sales.cantidad
													})


												})

												/*=============================================
												Sumamos ventas realizadas en la misma fecha
												=============================================*/

												let graph = [];
												// console.log("grafico:", this.graph);

												this.graph.reduce((res, value) => {

													if (!res[value.date]) {

														res[value.date] = { date: value.date, price: 0 }
														graph.push(res[value.date])

													}

													res[value.date].price += Number(value.price);

													return res;

												}, {})

												let graphPie = [];

												this.graphPie.reduce((res, value) => {
													if (!res[value.producto]) {

														res[value.producto] = { producto: value.producto, cantidad: 0 }
														graphPie.push(res[value.producto])

													}

													res[value.producto].cantidad += Number(value.cantidad);

													return res;
												}, {});

												// console.log("graph pie:", this.graphPie)

												/*=============================================
												Ordenamos el arreglo en fecha de menor a mayor
												=============================================*/

												graph.sort((a, b) => {

													return new Date(a.date).getTime() - new Date(b.date).getTime()

												})

												graphPie.sort((a, b) => {

													return a.cantidad - b.cantidad

												})

												/*=============================================
												Separamos fecha y precios
												=============================================*/

												graph.forEach((value, index) => {

													this.dataDate[index] = value.date;
													this.dataProfit[index] = value.price.toFixed(2);


												})

												graphPie.forEach((value, index) => {


													this.productName[index] = value.producto;
													this.cantidadProduct[index] = value.cantidad;

												})



												// console.log("productName:", this.productName);
												// console.log("cantiad product :", this.cantidadProduct);
												// console.log("dataProfit:", this.dataProfit);
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
															label: 'Ventas',
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
												var randomScalingFactor = function () {
													return Math.round(Math.random() * 100);
												};
												var configPieChart = {
													type: 'pie',
													data: {
														datasets: [{
															data: this.cantidadProduct,
															backgroundColor: [
																"#7dcea0",
																'#b1cc43',
																'#cc9043',
																'#0099cc',
																"#FFA07A",
																"#9370DB",
																"#FFE4E1",
																
															],
															label: 'Dataset 1'
														}],
														labels: this.productName
													},
													options: {
														responsive: true
													}
												};


												ChartJsPie.fnc(configPieChart);
												ChartJs.fnc(config);

												/*=============================================
												Disparamos el trigger de Datatable
												=============================================*/

												this.dtTrigger.next();

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

	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy(): void {

		this.dtTrigger.unsubscribe();

	}

}