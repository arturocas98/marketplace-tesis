import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-promotion',
  templateUrl: './header-promotion.component.html',
  styleUrls: ['./header-promotion.component.css']
})
export class HeaderPromotionComponent implements OnInit {
  public url_image:string = environment.url_image;
  public top_banner:any;
  public preload:boolean;

  constructor(
    private productoService:ProductoService,
  ) {
    this.top_banner = {};
    this.preload = false;
  }

  ngOnInit(): void {
    this.preload = true;
    this.getData();
  }

  getData(){
    this.productoService.getAll()
		.subscribe(resp =>{
			
			// console.log("resp", resp[Object.keys(resp)[1]]);

			/*=============================================
			Tomar la longitud del objeto
			=============================================*/

			let i;
			let size = 0;

			for(i in resp){

				size++			

			}

			/*=============================================
			Generar un número aleatorio 
			=============================================*/

			let index = Math.floor(Math.random()*size);

			/*=============================================
			Devolvemos a la vista un banner aleatorio
			=============================================*/

			this.top_banner = JSON.parse(resp[Object.keys(resp)[index]].top_banner);
			this.preload = false;
		

		})
  }

}
