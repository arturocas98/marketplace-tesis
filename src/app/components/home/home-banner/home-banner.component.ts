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
      this.preload =false;
      let i;
			let size = 0;

			for(i in resp){

				size++			

      }
      if (size > 5) {
        index = Math.floor(Math.random()*(size-5));

      }
      this.productoService.getLimit( Object.keys(resp)[index],5).subscribe(
        res=>{
          let count = 0;
          for (const i in res) {
            count ++;
            this.banner_home.push(JSON.parse(res[i].horizontal_slider));
            this.categoria.push(res[i].categoria);
            this.url.push(res[i].url);
          }

          setTimeout(function(){
            OwlCarouselConfig.fnc();
            backgroundImage.fnc();
          },count*100);

        }
      )
    })
  }


  // getPlugins(){
  //   if (this.render) {
  //     this.render = false;
  //     OwlCarouselConfig.fnc();
  //     backgroundImage.fnc();
  //   }
  // }

}
