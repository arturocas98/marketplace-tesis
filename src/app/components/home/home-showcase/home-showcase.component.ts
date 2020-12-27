import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';
import { Rating,OwlCarouselConfig } from '../../../functions';

declare var $: any;
declare var jQuery: any;
@Component({
	selector: 'app-home-showcase',
	templateUrl: './home-showcase.component.html',
	styleUrls: ['./home-showcase.component.css']
})
export class HomeShowcaseComponent implements OnInit {

	public url_image: string;
	public cargando: boolean;
	public categorias: Array<any>;
	public render: boolean;
	constructor(
		public categoriaService: CategoriaService,
		public subcategoriaService: SubcategoriaService,
		public productoService: ProductoService

	) {
		this.url_image = environment.url_image;
		this.cargando = false;
		this.categorias = [];
		this.render = true;
	}

	ngOnInit(): void {
		this.getCategorias();
	}

	getCategorias() {
		this.cargando = true;

		/*=============================================
			Tomamos la data de las categorias
			=============================================*/

		let getCategories = [];

		this.categoriaService.getAll().subscribe(resp => {

			let i;

			for (i in resp) {

				getCategories.push(resp[i])

			}

			/*=============================================
			Ordenamos de mayor vistas a menor vistas el arreglo de objetos
			=============================================*/

			getCategories.sort(function (a, b) {

				return (b.view - a.view)

			})

			/*=============================================
			Filtramos hasta 6 categorías
			=============================================*/

			getCategories.forEach((category, index) => {

				if (index < 6) {

					this.categorias[index] = getCategories[index];
					this.cargando = false;
				}

			})


		})
	}

	callback(indexes) {

		if (this.render) {

			this.render = false;

			let arraySubCategories = [];
			let arrayProducts = [];
			let preloadSV = 0;

			/*=============================================
			Separar las categorías
			=============================================*/

			this.categorias.forEach((categoria, index) => {

				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/
				this.subcategoriaService.getByFilter("categoria", categoria.nombre)
					.subscribe(resp => {

						let i;

						for (i in resp) {

							arraySubCategories.push({

								"categoria": resp[i].categoria,
								"subcategoria": resp[i].nombre,
								"url": resp[i].url

							})

						}

						/*=============================================
						Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
						=============================================*/

						for (i in arraySubCategories) {

							if (categoria.nombre == arraySubCategories[i].categoria) {

								$(`[categoria-showcase='${categoria.nombre}']`).append(`

								<li><a href="productos/${arraySubCategories[i].url}">${arraySubCategories[i].subcategoria}</a></li>

							`)
							}
						}

					})
				this.productoService.getByFilterLimit("categoria", categoria.url, 6)
					.subscribe(resp => {
						let i;

						for (i in resp) {

							arrayProducts.push({

								"categoria": resp[i].categoria,
								"url": resp[i].url,
								"nombre": resp[i].nombre,
								"imagen": resp[i].imagen,
								"precio": resp[i].precio,
								"oferta": resp[i].oferta,
								"reviews": resp[i].reviews,
								"stock": resp[i].stock,
								"vertical_slider": resp[i].vertical_slider

							})

						}


						/*=============================================
						Recorremos el array de objetos nuevo para buscar coincidencias con las url de categorías
						=============================================*/
						for (i in arrayProducts) {

							if (categoria.url == arrayProducts[i].categoria) {

								let precio;
								let type;
								let value;
								let offer;
								let disccount = "";
								let offerDate;
								let today = new Date();

								if (arrayProducts[i].oferta != "") {

									offerDate = new Date(

										parseInt(JSON.parse(arrayProducts[i].oferta)[2].split("-")[0]),
										parseInt(JSON.parse(arrayProducts[i].oferta)[2].split("-")[1]) - 1,
										parseInt(JSON.parse(arrayProducts[i].oferta)[2].split("-")[2])

									)

									if (today < offerDate) {

										type = JSON.parse(arrayProducts[i].oferta)[0];
										value = JSON.parse(arrayProducts[i].oferta)[1];
										if (type == "Descuento") {

											offer = (arrayProducts[i].precio - (arrayProducts[i].precio * value / 100)).toFixed(2)
										}

										if (type == "Fijo") {

											offer = value;
											value = Math.round(offer * 100 / arrayProducts[i].precio);

										}

										disccount = `<div class="ps-product__badge">-${value}%</div>`;

										precio = `<p class="ps-product__price sale">$${offer} <del>$${arrayProducts[i].precio} </del></p>`

									} else {



										precio = `<p class="ps-product__price">$${arrayProducts[i].precio} </p>`
									}

								} else {



									precio = `<p class="ps-product__price">$${arrayProducts[i].precio} </p>`
								}


								let totalReview = 0;

								for (let f = 0; f < JSON.parse(arrayProducts[i].reviews).length; f++) {

									totalReview += Number(JSON.parse(arrayProducts[i].reviews)[f]["review"])

								}

								let rating = Math.round(totalReview / JSON.parse(arrayProducts[i].reviews).length);

								if (arrayProducts[i].stock == 0) {

									disccount = `<div class="ps-product__badge out-stock">Sin stock</div>`;

								}

								$(`[categoria-pb='${arrayProducts[i].categoria}']`).append(`

								 <div class="ps-product ps-product--simple">

				                    <div class="ps-product__thumbnail">

				                    	<a href="product/${arrayProducts[i].url}">

				                    		<img src="assets/img/products/categorias/${arrayProducts[i].categoria}/${arrayProducts[i].imagen}" alt="">

				                    	</a>

				                        ${disccount}

				                    </div>

				                    <div class="ps-product__container">

				                        <div class="ps-product__content" data-mh="clothing">

				                        	<a class="ps-product__title" href="product/${arrayProducts[i].url}">${arrayProducts[i].nombre}</a>

				                            <div class="ps-product__rating">

				                                <select class="ps-rating productRating" data-read-only="true">

				                                </select>

				                                <span>${rating}</span>

				                            </div>

				                            ${precio}

				                        </div>

				                    </div>

				                </div> 

			                `)

							let arrayRating = $(".productRating");

							for(let i = 0; i < arrayRating.length; i++){

								for(let f = 1; f <= 5; f++){
								
									$(arrayRating[i]).append(

										`<option value="2">${f}</option>`
									)

									if(rating == f){

										$(arrayRating[i]).children('option').val(1)

									}

								}
							
							}

							Rating.fnc();

							$(`[categoria-sl='${arrayProducts[i].categoria}']`).append(`

								<a href="productos/${arrayProducts[i].url}">

			                		<img src="assets/img/products/categorias/${arrayProducts[i].categoria}/vertical/${arrayProducts[i].vertical_slider}" alt="">

			                	</a>

							`)
							// OwlCarouselConfig.fnc()
							preloadSV++;
							let tamanio = 30;
							console.log("preloadsv:",preloadSV);
							console.log("indexes:",indexes);
							if(tamanio == (indexes+1)*6){
								
								console.log("entro");
								$(`[categoria-sl]`).addClass('ps-carousel--product-box')
								$(`[categoria-sl]`).addClass('owl-slider')

								$(`[categoria-sl]`).owlCarousel({

									 items: 1,
									 autoplay: true,
									 autoplayTimeout: 7000,
									 loop: true,
                        		     nav: true,
                        		     margin: 0,
                        		     dots: true,
                        		     navSpeed: 500,
                        		     dotsSpeed: 500,
                        		     dragEndSpeed: 500,
                        		     navText: ["<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"],

								});

							}


							}
						}
					});

			})

		}
	}

}
