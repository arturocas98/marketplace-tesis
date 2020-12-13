import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';
import { CountDown, ProductLightbox, carouselNavigation,SlickConfig } from '../../../functions';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {
  public url_image: string;
  public getProducts: Array<any>;
  public products: Array<any>;
  public now: Date;
  public fecha_oferta;
  public indexes: Array<any>;
  public render: boolean;
  public preload:boolean;

  constructor(
    private productoService: ProductoService
  ) {
    this.url_image = environment.url_image;
    this.getProducts = [];
    this.now = new Date();
    this.fecha_oferta = null;
    this.indexes = [];
    this.render = true;
    this.products = [];
    this.preload  =false;

  }

  ngOnInit(): void {
    this.preload =true;
    this.getProductos();
  }
  getProductos() {
    this.productoService.getAll().subscribe(res => {
      let i;
      for (const i in res) {
        this.getProducts.push(
          {
            "offer": JSON.parse(res[i].offer),
            "stock": res[i].stock
          }

        )
        this.products.push(res[i]);

      }

      for (const i in this.getProducts) {
        this.fecha_oferta = new Date(
          parseInt(this.getProducts[i]['offer'][2].split("-")[0]),
          parseInt(this.getProducts[i]['offer'][2].split("-")[1]) - 1,
          parseInt(this.getProducts[i]['offer'][2].split("-")[2]),

        )
        if (this.now < this.fecha_oferta && this.getProducts[i]["stock"] > 0) {
          this.indexes.push(i);
          this.preload = false;
        }

      }

      // console.log("indexes:", this.indexes);
    })
  }

  callback() {
    if (this.render) {
      this.render = false;
      

      let galleryMix_1 = $(".galleryMix_1");
      let galleryMix_2 = $(".galleryMix_2");
      let galleryMix_3 = $(".galleryMix_3");

      //recorremos todos los productos cumpla la condicion de hot today
      for (let i = 0; i < galleryMix_1.length; i++) {
        // recorremos las fotografias de la galeria de cada producto
        for (let j = 0; j < JSON.parse($(galleryMix_1[i]).attr("gallery")).length; j++) {
          $(galleryMix_2[i]).append(
            `<div class="item" >
              <a href="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" >
                <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" alt = "" >
              </a>
            </div>`


          
          )
          $(galleryMix_3[i]).append(
            ` <div class="item">
              <img src="assets/img/products/categorias/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[j]}" alt="">
            </div>`
          )
          
        }
      }

      
      let offer_1 = $(".offer_1");
      let offer_2 = $(".offer_2");
      let offer_3 = $(".offer_3");
      for (let i = 0; i < offer_1.length; i++) {
        let offer = JSON.parse($(offer_1[i]).attr("offer"));
        let price = JSON.parse($(offer_1[i]).attr("price"));
        if(offer[0] =='Descuento'){
          $(offer_1[i]).html(

						`<span>Save <br> $${(price * offer[1]/100).toFixed(2) }</span>`

					)

					$(offer_2[i]).html(`$${(price-(price * offer[1]/100)).toFixed(2)}`)	
        }

        if(offer[0] == "Fijo"){

					$(offer_1[i]).html(

						`<span>Save <br> $${(price-offer[1]).toFixed(2) }</span>`

					)

					$(offer_2[i]).html(`$${offer[1]}`)	

        }
        
        $(offer_3[i]).attr("data-time", 

						new Date(

						parseInt(offer[2].split("-")[0]),
						parseInt(offer[2].split("-")[1])-1,
						parseInt(offer[2].split("-")[2])

					)

				)	

      }

      // OwlCarouselConfig.fnc();
      ProductLightbox.fnc();
      SlickConfig.fnc();
      carouselNavigation.fnc();
      CountDown.fnc();

    }
  }

}
