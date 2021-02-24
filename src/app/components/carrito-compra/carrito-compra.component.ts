import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { VentaService } from 'src/app/core/venta/venta.service';
import { environment } from 'src/environments/environment';
import { DinamicPrice, Quantity, Sweetalert } from '../../functions';

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.component.html',
  styleUrls: ['./carrito-compra.component.css']
})
export class CarritoCompraComponent implements OnInit, OnDestroy {
  path: string = environment.url_image;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public shoppingCart: any[] = [];
  public totalShoppingCart: number = 0;
  render: boolean = true;
  totalP: string = `<div  class="text-right"><h4>Total <span class="totalP"><div class="spinner-border subTotalPriceM"></div></span></h4></div>   `;
  subTotalSinEnvio: string = `<div  class="text-right"><h4>Subtotal <span class="subTotalSinEnvio"><div class="spinner-border"></div></span></h4></div>   `;
  envio: string = `<div  class="text-right"><h4>Envio <span class="valorEnvio"><div class="spinner-border"></div></span></h4></div>   `;
  carrito_tienda: any[] = [];
  valor_envio: number = 0;
  // envio:boolean=false;
  constructor(
    private productoService: ProductoService,
    private router: Router,
    private tiendaService: TiendaService
  ) { }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    }

    if (localStorage.getItem('list-shopping-cart')) {
      let list = JSON.parse(localStorage.getItem('list-shopping-cart'));
      this.totalShoppingCart = list.length;
      let load = 0;
      for (const i in list) {

        this.productoService.getByFilter('url', list[i].producto).subscribe(
          res => {
            for (const j in res) {
              load++;
              this.tiendaService.getFilterData("tienda", res[j].tienda).subscribe(respTienda => {
                if (Object.keys(respTienda).length > 0) {

                  for (const l in respTienda) {
                    this.carrito_tienda.push({
                      "tienda": respTienda[l].tienda,
                      "precio_envio": respTienda[l].precio_envio
                    })

                    res[j].precio_envio = respTienda[l].precio_envio;

                    this.shoppingCart.push({
                      url: res[j].url,
                      nombre: res[j].nombre,
                      imagen: res[j].imagen,
                      tiempo_entrega: res[j].tiempo_entrega,
                      cantidad: list[i].unidad,
                      precio: DinamicPrice.fnc(res[j])[0],
                      shipping: res[j].shipping,
                      categoria: res[j].categoria,
                      tienda: res[j].tienda,
                      precio_envio: res[j].precio_envio
                    });
                  }
                  console.log("this shopping cart:",this.shoppingCart);

                  this.shoppingCart.sort((a, b) => {
                    return b.tienda - a.tienda;
                  });
          
                }

              });

              if (load == list.length) {

                this.dtTrigger.next();

              }
            }

          }
        );

      }


    }



  }

  callback() {
    if (this.render) {
      this.render = false;
      this.totalPrice(this.totalShoppingCart);
      setTimeout(function () {

        Quantity.fnc();

      }, this.totalShoppingCart * 100);
    }
  }

  changeCantidad(cantidad, unidad, movimiento, product) {
    let number = 1;
    if (Number(cantidad) > 100) {
      cantidad = 100;
    }
    if (Number(cantidad) < 1) {
      cantidad = 1;
    }

    if (movimiento == 'up' && Number(cantidad) < 100) {
      number = Number(cantidad) + unidad;
    }

    else if (movimiento == 'down' && Number(cantidad) < 100) {
      number = Number(cantidad) - unidad;
    }
    else {
      number = Number(cantidad);
    }

    // $('.quantity input ').val(cantidad);
    // this.cantidad = number;

    if (localStorage.getItem("list-shopping-cart")) {

      let shoppingCart = JSON.parse(localStorage.getItem("list-shopping-cart"));

      shoppingCart.forEach(list => {

        if (list.producto == product) {

          list.unidad = number;
        }

      })

      localStorage.setItem("list-shopping-cart", JSON.stringify(shoppingCart));

      this.totalPrice(shoppingCart.length)

    }
  }

  totalPrice(totalShoppingCart) {
    let localValorEnvio = this.valor_envio;
    let localCarritoTienda = this.carrito_tienda;

    setTimeout(function () {

      let price = $(".pShoppingCart .end-price");
      let quantity = $(".qShoppingCart");
      let shipping = $(".sShoppingCart");
      let subTotalPrice = $(".subTotalPrice");

      let total = 0;
      let total_sin_envio = 0;
      let total_con_envio = 0;
      let valor_envio = 0;
      for (let i = 0; i < price.length; i++) {

        /*=============================================
        Sumar precio con envío
        =============================================*/
        let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());
        // console.log("shipping_price:",shipping_price);
        /*=============================================
        Multiplicar cantidad por precio con envío
        =============================================*/

        // let subTotal = Number($(quantity[i]).val()) * shipping_price;
        let subTotal_sin_envio = Number($(quantity[i]).val()) * Number($(price[i]).html());

        // console.log("subtotal sin envio:",subTotal_sin_envio);

        /*=============================================
        Mostramos subtotales de cada producto
        =============================================*/

        $(subTotalPrice[i]).html(`$${subTotal_sin_envio.toFixed(2)}`)

        /*=============================================
        Definimos el total de los precios
        =============================================*/

        total_sin_envio += subTotal_sin_envio;



      }
      $(".subTotalSinEnvio").html(`$${total_sin_envio.toFixed(2)}`)

      let tiendas_filter = [];
      localCarritoTienda.reduce((res, value) => {
        if (!res[value.tienda]) {

          res[value.tienda] = { tienda: value.tienda, precio_envio: value.precio_envio }
          tiendas_filter.push(res[value.tienda])

        }
        return res;

      }, {});

      console.log("tiendas_filter:",tiendas_filter);
      
      tiendas_filter.forEach(tienda => {
        valor_envio += tienda.precio_envio;
      });
      console.log("valor_envio:",valor_envio);

      if (total_sin_envio >= 25) {
        valor_envio = 0;
        total_con_envio = total_sin_envio + valor_envio;
      } else {
        // valor_envio = localValorEnvio;
        total_con_envio = total_sin_envio + valor_envio;
        console.log("total_con_envio:", total_con_envio);
      }
      total = total_con_envio;
      console.log("total:", total);
      $(".valorEnvio").html(`$${valor_envio.toFixed(2)}`)

      $(".totalP").html(`$${total.toFixed(2)}`)


    }, totalShoppingCart * 1000)

  }

  removeProduct(product) {


    if (localStorage.getItem("list-shopping-cart")) {

      let shoppingCart = JSON.parse(localStorage.getItem("list-shopping-cart"));
      shoppingCart.forEach((list, index) => {

        if (list.producto == product) {

          shoppingCart.splice(index, 1);

        }

      })

      /*=============================================
       Actualizamos en LocalStorage la lista del carrito de compras
       =============================================*/

      localStorage.setItem("list-shopping-cart", JSON.stringify(shoppingCart));

      Sweetalert.fnc("success", "Producto removido ", this.router.url)

    }

  }


  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();

  }



}
