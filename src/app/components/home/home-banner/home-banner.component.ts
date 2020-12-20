import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';
import { OwlCarouselConfig,backgroundImage } from '../../../functions';
@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {
  public url_image:String;
  public banner_home:Array<any>;
  public categoria:any;
  public url:any;
  public render:boolean;
  public preload:boolean;


  constructor(
    private productoService:ProductoService,

  ) { 
    this.url_image = environment.url_image;
    this.banner_home = [];
    this.categoria = [];
    this.url = [];
    this.render =true;
    this.preload  =false;
  }

  ngOnInit(): void {
    this.preload =true;
    this.getData();
  }
  getData(){
    let index = 0; 
    this.productoService.getAll()
		.subscribe(resp =>{
      console.log("productos:",resp);
      this.preload =false;
      let i;
			let size = 0;

			for(i in resp){

				size++			

      }
      console.log("size:",size);
      if (size > 5) {
        index = Math.floor(Math.random()*(size-5));

      }
      console.log("indice:",index);
      this.productoService.getLimit( Object.keys(resp)[index],5).subscribe(
        res=>{
          console.log("res_home_banner:",res);
          for (const i in res) {
            
            this.banner_home.push(JSON.parse(res[i].horizontal_slider));
            this.categoria.push(res[i].category);
            this.url.push(res[i].url);
          }
          console.log("categorias:",this.categoria);
        }
      )
    })
  }


  getPlugins(){
    if (this.render) {
      this.render = false;
      OwlCarouselConfig.fnc();
      backgroundImage.fnc();
    }
  }

}
