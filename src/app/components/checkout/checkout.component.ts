import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { MyValidators } from '../utils/MyValidators';
import { Capitalize, Sweetalert, DinamicPrice, Paypal } from '../../functions';
import { ThrowStmt } from '@angular/compiler';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { VentaService } from 'src/app/core/venta/venta.service';
import * as Cookies from 'js-cookie';
import { TiendaService } from 'src/app/core/tienda/tienda.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  path: string = environment.url_image;
  usuario: Usuario;
  id: string = null;
  public form: FormGroup;
  public validators: MyValidators;
  // guardar_direccion: boolean = false;
  public shoppingCart: any[] = [];
  public render: boolean = true;
  totalShoppingCart: number = 0;
  totalP: string = `<h4 class="text-right">Total <span class="totalCheckout" ><div class="spinner-border" ></div></span></h4>`;
  subTotalSinEnvio: string = `<div  class="text-right"><h4>Subtotal <span class="subTotalSinEnvio"><div class="spinner-border"></div></span></h4></div>   `;
  envio: string = `<div  class="text-right"><h4>Envio <span class="valorEnvio"><div class="spinner-border"></div></span></h4></div>   `;
  totalPrice: any[] = [];
  subTotalPrice: any[] = [];
  validateCoupon: boolean = false;
  carrito_tienda: any[] = [];
  constructor(
    public router: Router,
    private userService: UsuarioService,
    public formBuilder: FormBuilder,
    private productService: ProductoService,
    private ordersService: OrdenesService,
    private ventaService: VentaService,
    private tiendaService: TiendaService
  ) {
    this.usuario = new Usuario();
    this.validators = new MyValidators();

  }

  ngOnInit(): void {

    if (Cookies.get('cupon') != undefined) {
      this.tiendaService.getFilterData("url", Cookies.get('cupon')).subscribe(res => {
        this.validateCoupon = true;
      });
    }
    this.initForm();
    this.userService.authActivate().then(resp => {
      if (resp) {
        this.userService.getFilterData('idToken', localStorage.getItem('idToken')).subscribe(
          res => {
            this.id = Object.keys(res).toString();
            console.log("res_user:", res);
            for (const i in res) {
              this.usuario.displayName = res[i].displayName;
              this.usuario.email = res[i].email;
              this.usuario.telefono = res[i].telefono;
              this.usuario.direccion = res[i].direccion;
              this.usuario.username = res[i].username;
            }
            this.setValueForm();
          }
        )
      }
    });
    if (localStorage.getItem('list-shopping-cart')) {
      let list = JSON.parse(localStorage.getItem('list-shopping-cart'));
      this.totalShoppingCart = list.length;
      if (list.length == 0) {
        this.router.navigateByUrl('carrito-compra');
        return;
      }
      for (const i in list) {
        this.productService.getByFilter('url', list[i].producto).subscribe(
          res => {
            for (const j in res) {
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
                  console.log("this shopping cart:", this.shoppingCart);

                  this.shoppingCart.sort((a, b) => {
                    return b.tienda - a.tienda;
                  });

                }

              });


            }

          }
        );
      }
    } else {
      this.router.navigateByUrl('carrito-compra');
      return;
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]/)]],
      // apellidos: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      direccion: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]/)]],
      guardar_direccion: [''],
      metodo_pago: ['', [Validators.required]],
      informacion_adicional: ['']

    });
  }

  setValueForm() {
    this.form.setValue({
      nombres: this.usuario.displayName,
      // apellidos: '',
      email: this.usuario.email,
      telefono: this.usuario.telefono ? this.usuario.telefono : '',
      direccion: this.usuario.direccion ? this.usuario.direccion : '',
      guardar_direccion: '',
      metodo_pago: '',
      informacion_adicional: ''
    });
  }
  guardarDireccion() {
    if (this.form.controls['guardar_direccion'].value == true) {
      if (this.form.controls['telefono'].value != '' && this.form.controls['direccion'].value != '') {
        let body = {
          direccion: this.form.controls['direccion'].value,
          telefono: this.form.controls['telefono'].value
        }
        this.userService.update(this.id, body).subscribe(res => {
          Sweetalert.fnc('success', 'Sus datos fueron actualizados', null);

        });
      } else {
        this.form.controls['guardar_direccion'].setValue(false);
        Sweetalert.fnc('error', 'Por favor llena los campos obligatorios', null);
      }
    }
  }

  setValues() {
    // this.usuario.nombres = this.form.controls['nombres'].value;
    // this.usuario.apellidos = this.form.controls['apellidos'].value;
    // this.usuario.email = this.form.controls['email'].value;
    // this.usuario.username = this.form.controls['username'].value;
    // this.usuario.password = this.form.controls['password'].value;

  }

  validatorErrorField(field) {
    return this.validators.validatorErrorField(field, this.form);
  }

  capitalize(input) {

    input.value = Capitalize.fnc(input.value)

  }

  callback() {
    if (this.render) {
      this.render = false;
      let totalShoppingCart = this.totalShoppingCart;
      let localTotalPrice = this.totalPrice;
      let localSubTotalPrice = this.subTotalPrice;
      let localCarritoTienda = this.carrito_tienda;
      setTimeout(function () {

        let price = $(".pCheckout .end-price");
        let quantity = $(".qCheckout");
        let shipping = $(".sCheckout");
        let subTotalPrice = $(".subTotalPriceCheckout");

        let total = 0;
        let total_sin_envio = 0;
        let total_con_envio = 0;
        let valor_envio = 0;
        for (let i = 0; i < price.length; i++) {

          /*=============================================
          Sumar precio con envío
          =============================================*/
          // let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());

          /*=============================================
          Multiplicar cantidad por precio con envío
          =============================================*/

          // let subTotal = Number($(quantity[i]).html()) * shipping_price;
          let subTotal_sin_envio = Number($(quantity[i]).html()) * Number($(price[i]).html());
          console.log("subtotal_sin_envio:", subTotal_sin_envio);
          /*=============================================
          Mostramos subtotales de cada producto
          =============================================*/

          $(subTotalPrice[i]).html(`$${subTotal_sin_envio.toFixed(2)}`);

          localSubTotalPrice.push(subTotal_sin_envio.toFixed(2));

          /*=============================================
          Definimos el total de los precios
          =============================================*/

          total_sin_envio += subTotal_sin_envio;
        }
        $(".subTotalSinEnvio").html(`$${total_sin_envio.toFixed(2)}`);

        let tiendas_filter = [];
        localCarritoTienda.reduce((res, value) => {
          if (!res[value.tienda]) {

            res[value.tienda] = { tienda: value.tienda, precio_envio: value.precio_envio }
            tiendas_filter.push(res[value.tienda])

          }
          return res;

        }, {});

        tiendas_filter.forEach(tienda => {
          valor_envio += tienda.precio_envio;
        });
        console.log("valor_envio:", valor_envio);

        if (total_sin_envio >= 25) {
          valor_envio = 0;
          total_con_envio = total_sin_envio + valor_envio;
        } else {
          total_con_envio = total_sin_envio + valor_envio;

        }
        total = total_con_envio;
        $(".valorEnvio").html(`$${valor_envio.toFixed(2)}`)
        $(".totalCheckout").html(`$${total.toFixed(2)}`)
        localTotalPrice.push(total.toFixed(2));
      }, totalShoppingCart * 500)
    }
  }


  onSubmit() {
    if (this.form.valid) {
      Sweetalert.fnc("loading", "Cargando ... ", null);
      if (this.form.controls['metodo_pago'].value == 'paypal') {
        Sweetalert.fnc('html', `<div id="paypal-button-container"></div>`, null);
        Paypal.fnc(this.totalPrice[0]).then(resp => {
          if (resp) {
            let totalRender = 0;
            this.shoppingCart.forEach((product, index) => {
              totalRender++;

              this.productService.getByFilter("url", product.url)
                .subscribe(resp => {

                  for (const i in resp) {

                    let id = Object.keys(resp).toString();

                    let value = {

                      ventas: Number(resp[i].ventas) + Number(product.cantidad),
                      stock: Number(resp[i].stock) - Number(product.cantidad),

                    }

                    this.productService.patchDataAuth(id, value, localStorage.getItem("idToken"))
                      .subscribe(resp => {

                      });

                    /*=============================================
                    Crear el proceso de entrega de la venta
                    =============================================*/

                    let moment = Math.floor(Number(product.tiempo_entrega) / 2);

                    let sentDate = new Date();
                    sentDate.setDate(sentDate.getDate() + moment);

                    let deliveredDate = new Date();
                    deliveredDate.setDate(deliveredDate.getDate() + Number(product.tiempo_entrega))

                    let proccess = [

                      {
                        stage: "revisando",
                        status: "ok",
                        comment: "Hemos recibido su pedido, iniciamos el proceso de despacho",
                        date: new Date()
                      },

                      {
                        stage: "enviando",
                        status: "pendiente",
                        comment: "",
                        date: sentDate
                      },
                      {
                        stage: "entregado",
                        status: "pendiente",
                        comment: "",
                        date: deliveredDate
                      }

                    ]

                    let body = {

                      tienda: product.tienda,
                      usuario: this.usuario.username,
                      producto: product.nombre,
                      url: product.url,
                      imagen: product.imagen,
                      categoria: product.categoria,
                      // details:product.details,
                      cantidad: product.cantidad,
                      precio: this.subTotalPrice[index],
                      email: this.form.controls['email'].value,
                      telefono: this.form.controls['telefono'].value,
                      direccion: this.form.controls['direccion'].value,
                      informacion_adicional: this.form.controls['informacion_adicional'].value,
                      proceso: JSON.stringify(proccess),
                      estado: "pendiente"

                    }

                    this.ordersService.registerDatabase(body, localStorage.getItem("idToken"))
                      .subscribe(resp => {
                        /* La respuesta de la orden trae un name que es el id q me genera 
                        firebase
                        */
                        if (resp['name'] != '') {
                          let commision = 0;
                          let unitPrice = 0;
                          // commision = Number(this.subTotalPrice[index]) * 0.25;
                          // unitPrice = Number(this.subTotalPrice[index]) * 0.75;
                          if (this.validateCoupon) {

                            commision = Number(this.subTotalPrice[index]) * 0.05;
                            unitPrice = Number(this.subTotalPrice[index]) * 0.95;

                          } else {

                            commision = Number(this.subTotalPrice[index]) * 0.25;
                            unitPrice = Number(this.subTotalPrice[index]) * 0.75;

                          }

                          console.log("comision:", commision);
                          console.log("precio_unitario:", unitPrice);

                          /*=============================================
                          Enviar información de la venta a la base de datos
                          =============================================*/

                          let id_payment = localStorage.getItem("id_payment");

                          let body = {

                            id_order: resp["name"],
                            client: this.usuario.username,
                            producto: product.nombre,
                            url: product.url,
                            cantidad: product.cantidad,
                            precio_unitario: unitPrice.toFixed(2),
                            comision: commision.toFixed(2),
                            total: this.subTotalPrice[index],
                            metodo_pago: this.form.controls['metodo_pago'].value,
                            id_pago: id_payment,
                            fecha_emision: new Date(),
                            estado: "pendiente"

                          }

                          this.ventaService.registerDatabase(body, localStorage.getItem("idToken"))
                            .subscribe(resp => { })
                        }
                      });

                  }

                })
            });

            if (totalRender == this.shoppingCart.length) {
              localStorage.removeItem("list-shopping-cart");
              Sweetalert.fnc("success", "Tu pedido se proceso correctamente", "cuenta-usuario/cuenta/mis-compras");

            }
          } else {


            Sweetalert.fnc("error", "No se pudo realizar la transacción, intentelo nuevamente", null);

          }
        })

      }
    } else {
      Sweetalert.fnc("error", "Llene todos los campos requeridos", null);
      // return;
    }
  }

}
