import { Component, Input, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import {
  DinamicPrice,
 
} from '../../../../functions';
declare var JQuery:any;
declare var $:any; 
@Component({
  selector: 'app-bought-together',
  templateUrl: './bought-together.component.html',
  styleUrls: ['./bought-together.component.css']
})
export class BoughtTogetherComponent implements OnInit {
  @Input() childItem: any;
  path: string = environment.url_image;
  products: Array<any> = [];
  price: Array<any> = [];
  render:boolean  = true;
  constructor(private productsService: ProductoService,private userService:UsuarioService) { }

  ngOnInit(): void {

    this.productsService.getByFilter("grupo", this.childItem['grupo']).subscribe(res => {

      this.productsFnc(res);
    })
    // console.log("childItem:",this.childItem);
  }

  productsFnc(response) {
    this.products.push(this.childItem);
    let getProduct = [];
    for (const i in response) {
      getProduct.push(response[i]);
    }
    //ordenando de mayor a menor vistas
    getProduct.sort(function (a, b) {
      return (b.vistas - a.vistas);
    })
    let random = Math.floor(Math.random()*getProduct.length);
    getProduct.forEach((product, index) => {
      let noIndex = 0;
      if (this.childItem['nombre'] == product['nombre']) {
        noIndex = index;
      }
      if (random == noIndex) {
        random = Math.floor(Math.random()*getProduct.length);
      }
      if (index != noIndex && index == random) {
        this.products.push(product);

      }
      
    })

    for(const i in this.products){
      this.price.push(DinamicPrice.fnc(this.products[i]));
    }
  }


  callback(){
    if (this.render) {
      this.render = false;

      let price = $(".endPrice .end-price");
  			
  			let total = 0;

  			for(let i = 0; i < price.length; i++){  				

  				total += Number($(price[i]).html())		
  				
  			}

  			$(".ps-block__total strong").html(`$${total.toFixed(2)}`)


    }
  }

  addWishList(producto_1,producto_2 ){
    this.userService.wishlist(producto_1);
    let localUserService = this.userService;
    setTimeout(function(){
      localUserService.wishlist(producto_2);
    },1000);
  }
}
