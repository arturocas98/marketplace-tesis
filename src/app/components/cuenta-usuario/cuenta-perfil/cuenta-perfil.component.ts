import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from 'src/app/core/ordenes/ordenes.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { Sweetalert } from '../../../functions';
import { MyValidators } from '../../utils/MyValidators';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-cuenta-perfil',
  templateUrl: './cuenta-perfil.component.html',
  styleUrls: ['./cuenta-perfil.component.css']
})
export class CuentaPerfilComponent implements OnInit {
  path: string = environment.url_image;
  vendedor: boolean = false;
  displayName: string;
  username: string;
  email: string;
  imagen: string;
  id: string;
  method: boolean = false;
  preload: boolean = false;
  // server:string = Server.url;
  public form: FormGroup;
  public validators: MyValidators;
  public needValidation: any;
  image: File = null;
  public server : string = environment.server;
  cuenta_url:string = null;
  store:any[] = [];
  ordersPending : number = 0;
  disputes: any[] = [];
  messages: any[] = [];
  constructor(
    private usersService: UsuarioService,
    public formBuilder: FormBuilder,
    public activatedRouter: ActivatedRoute,
    private http:HttpClient,
    private tiendaService:TiendaService,
    private ordersService:OrdenesService
  ) {
    this.validators = new MyValidators();

  }

  ngOnInit(): void {
    this.initForm();
    this.preload = true;
    this.cuenta_url  = this.activatedRouter.snapshot.params["param"]; 
    this.needValidation = this.validators.needValidation();

    this.usersService.authActivate().then(resp => {

      if (resp) {

        this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
          .subscribe(resp => {

            this.id = Object.keys(resp).toString();

            for (const i in resp) {

              /*=============================================
              Preguntamos si es vendedor
              =============================================*/
              this.tiendaService.getFilterData('username',resp[i].username).subscribe(respTienda=>{
                if (Object.keys(respTienda).length > 0) {
                  this.vendedor = true;                  
                }
                for(const i in respTienda){
                  this.store.push(respTienda[i]);
                  this.ordersService.getFilterData("tienda", respTienda[i].tienda)
									.subscribe(resp=>{
										
										if(Object.keys(resp).length > 0){

											for(const i in resp){

												if(resp[i].estado == "pendiente"){

													this.ordersPending++;
												}
											
											}

										}

									})
                }
              });
          
              this.displayName = resp[i].displayName;
              this.username = resp[i].username;
              this.email = resp[i].email;

              if (resp[i].imagen != undefined) {

                if (resp[i].metodo_registro != "directo") {

                  this.imagen = resp[i].imagen;

                } else {

                  this.imagen = `assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].imagen}`;
                }

              } else {

                this.imagen = `assets/img/users/default/default.png`;
              }

              /*=============================================
              Método de registro
              =============================================*/

              if (resp[i].metodo_registro != "directo") {

                this.method = true;
              }

              this.preload = false;

            }

          })

      }

    })
    this.validators.tooltip();
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      password_reset: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],

    });
  }

  newPassword() {
    if (this.form.controls['password_reset'].valid) {
      if (this.form.controls['password_reset'].value != "") {

        Sweetalert.fnc("loading", "Cargando...", null)

        let body = {

          idToken: localStorage.getItem('idToken'),
          password: this.form.controls['password_reset'].value,
          returnSecureToken: true,
        }

        this.usersService.changePasswordFnc(body)
          .subscribe(resp1 => {

            let value = {

              idToken: resp1["idToken"]
            }

            this.usersService.update(this.id, value)
              .subscribe(resp2 => {

                /*=============================================
              Almacenamos el Token de seguridad en el localstorage
              =============================================*/

                localStorage.setItem("idToken", resp1["idToken"]);

                /*=============================================
                Almacenamos la fecha de expiración localstorage
                =============================================*/

                let today = new Date();

                today.setSeconds(resp1["expiresIn"]);

                localStorage.setItem("expiresIn", today.getTime().toString());

                Sweetalert.fnc("success", "Contraseña cambiada correctamente", "/cuenta-usuario/cuenta")

              })

          }, err => {

            Sweetalert.fnc("error", err.error.error.message, null)

          })

      }
    } else {
      return;
    }


  }

  validatorErrorField(field) {
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }

  validateImage(e) {
    this.image = e.target.files[0];

    if(this.image["type"] !== "image/jpeg" && this.image["type"] !== "image/png"){
      Sweetalert.fnc('error', "La imagen debe ser jpg o png", null);
      return;
    } else if (this.image['size'] > 2000000) {
      Sweetalert.fnc("error", "La imagen no debe ser mayor a 2MB", null)

      return;
    }else{

      let data = new FileReader();
      data.readAsDataURL(this.image);

        $(data).on("load", function(event){
          
          let path = event.target.result; 
          $(".changePicture").attr("src", path)     

        })

    }

  }

  uploadImage(){
    const formData = new FormData();
    formData.append('file',this.image);
    formData.append('folder',this.username);
    formData.append('path','users');
    formData.append('width','200');
    formData.append('height','200');

    this.http.post(this.server,formData).subscribe(res=>{
      if (res['status'] == 200) {
        let body = {

          "imagen": res ['data']
        }
        this.usersService.update(this.id,body).subscribe(resp=>{
          if (resp['imagen'] != '' ) {
            Sweetalert.fnc('success','Tu foto se ha subido correctamente!','/cuenta-usuario/cuenta');
          }
        });
      }
    })
  }

}
