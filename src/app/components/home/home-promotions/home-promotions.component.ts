import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-promotions',
  templateUrl: './home-promotions.component.html',
  styleUrls: ['./home-promotions.component.css']
})
export class HomePromotionsComponent implements OnInit {
  public url_image: string;
  public banner_default:Array<any>;
  public categoria:any;
  public url:any;
  public preload:boolean;

  constructor(
    private productoService:ProductoService,

  ) {
    this.url_image = environment.url_image;
    this.banner_default = [];
    this.categoria = [];
    this.url = [];
  }

  ngOnInit(): void {
    this.preload = true;
    this.getData();
  }
  getData(){
    let index = 0; 
    this.productoService.getAll()
		.subscribe(resp =>{
      this.preload =false;
      let i;
			let size = 0;

			for(i in resp){

				size++			

      }
      if (size > 5) {
        index = Math.floor(Math.random()*size-2);

      }
      this.productoService.getLimit( Object.keys(resp)[index],2).subscribe(
        res=>{ 
          // console.log("banner_default:",res);
          for (const i in res) {
            
            this.banner_default.push(res[i].default_banner);
            this.categoria.push(res[i].categoria);
            this.url.push(res[i].url);
          }
        }
      )
     
    })
  }

}
