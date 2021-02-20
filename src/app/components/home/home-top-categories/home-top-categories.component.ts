import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-home-top-categories',
	templateUrl: './home-top-categories.component.html',
	styleUrls: ['./home-top-categories.component.css']
})
export class HomeTopCategoriesComponent implements OnInit {
	public url_image: string;
	public cargando: boolean;
	public categorias: Array<any>;
	constructor(
		public categoriaService: CategoriaService,

	) {
		this.url_image = environment.url_image;
		// this.cargando = false;
		this.categorias = [];
	}

	ngOnInit(): void {
		this.cargando = true;
		this.getCategorias();
	}

	getCategorias() {

		/*=============================================
			Tomamos la data de las categorias
			=============================================*/

		let getCategories = [];

		this.categoriaService.getAll().subscribe(resp => {
			this.cargando = false;

			let i;

			for (i in resp) {

				getCategories.push(resp[i])

			}

			/*=============================================
			Ordenamos de mayor vistas a menor vistas el arreglo de objetos
			=============================================*/

			getCategories.sort(function (a, b) {

				return (b.vistas - a.vistas)

			})

			/*=============================================
			Filtramos hasta 6 categorías
			=============================================*/

			getCategories.forEach((category, index) => {

				if (index < 6) {

					this.categorias[index] = getCategories[index];
					
				}

			})



		})


	}

}
