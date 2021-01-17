import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import {
  OwlCarouselConfig,
  carouselNavigation,
  Rating,
  DinamicRating,
  DinamicReviews,
  DinamicPrice,
  CountDown,
  ProgressBar,
  Tabs,
  SlickConfig,
  ProductLightbox,
  Quantity
} from '../../../functions';
@Component({
  selector: 'app-producto-left',
  templateUrl: './producto-left.component.html',
  styleUrls: ['./producto-left.component.css']
})
export class ProductoLeftComponent implements OnInit {
  path: string = environment.url_image;
  product: Array<any> = [];
  rating: Array<any> = [];
  reviews: Array<any> = [];
  price: Array<any> = [];
  cargando: Boolean = false;
  render: boolean = true;
  countd: Array<any> = [];
  gallery: Array<any> = [];
  render_gallery: boolean = true;
  video: string = null;
  tags: string = null;
  totalReviews: String;
  oferta_valida:boolean = false;
  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductoService,
    private userService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.productService.getByFilter("url", this.activateRoute.snapshot.params["param"]).subscribe(resp => {
      console.log("resp:", resp);
      this.productsFnc(resp);
    })
  }

  productsFnc(response) {

    this.product = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    let i;
    let getProduct = [];

    for (i in response) {

      getProduct.push(response[i]);

    }


    /*=============================================
    Filtramos solo hasta 10 productos
    =============================================*/

    getProduct.forEach((product, index) => {



      this.product.push(product);

      this.rating.push(DinamicRating.fnc(this.product[index]));

      this.reviews.push(DinamicReviews.fnc(this.rating[index]));

      this.price.push(DinamicPrice.fnc(this.product[index]));

      if (this.product[index].oferta != '') {
        let today = new Date();
        let offerDate = new Date(
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[0]),
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[1]) - 1,
          parseInt(JSON.parse(this.product[index].oferta)[2].split("-")[2]),

        );
        if (today < offerDate) {
          const date = JSON.parse(this.product[index].oferta)[2];
          this.countd.push(
            new Date(
              parseInt(date.split('-')[0]),
              parseInt(date.split('-')[1]) - 1,
              parseInt(date.split('-')[2]),

            )
          );
          this.oferta_valida = true;
        }

      }

      // galeria

      this.gallery.push(JSON.parse(this.product[index].galeria));


      /*=============================================
      Video
      =============================================*/

      if (JSON.parse(this.product[index].video)[0] == "youtube") {

        this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `

      }

      if (JSON.parse(this.product[index].video)[0] == "vimeo") {

        this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`

      }
      this.tags = this.product[index].etiquetas.split(',');
      this.totalReviews = JSON.parse(this.product[index]["reviews"]).length;
      this.cargando = false;



    })

  }


  callback() {
    if (this.render) {
      this.render = false;
      Rating.fnc();
      CountDown.fnc();
      ProgressBar.fnc();
      Tabs.fnc();
      Quantity.fnc();
    }
  }

  callbackGallery() {
    if (this.render_gallery) {
      this.render_gallery = false;
      SlickConfig.fnc();
      ProductLightbox.fnc();
    }
  }

  addWishList(producto) {
    this.userService.wishlist(producto);
  }

}
