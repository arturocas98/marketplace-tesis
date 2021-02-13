import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MyValidators } from '../utils/MyValidators';
import { Capitalize, Sweetalert, Tooltip } from '../../functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth';
import { TiendaService } from 'src/app/core/tienda/tienda.service';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;
  public needValidation;
  public validators: MyValidators;
  public form: FormGroup;
  public recuerdame: boolean = false;

  constructor(
    public usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
    public activatedRouter: ActivatedRoute,
    public router: Router,
    private afAuth: AngularFireAuth,
    private storeService:TiendaService


  ) {
    this.usuario = new Usuario();
    this.validators = new MyValidators();

  }

  ngOnInit(): void {
    console.log("email:", localStorage.getItem("email"));
    this.initForm();
    if (localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe") == 'yes') {
      this.usuario.email = localStorage.getItem("email");
      this.recuerdame = true;
      this.setValueForm();
    }

    this.needValidation = this.validators.needValidation();
    Tooltip.fnc();
    this.confirmarCorreo();
    this.changePassword();
  }

  setValueForm() {
    this.form.setValue({
      email: this.usuario.email,
      recuerdame: this.recuerdame,
      password: '',
      email_forgot: '',
      password_reset: ''
    });
  }

  confirmarCorreo() {
    if (this.activatedRouter.snapshot.queryParams["oobCode"] != undefined &&
      this.activatedRouter.snapshot.queryParams["mode"] == "verifyEmail") {

      let body = {

        oobCode: this.activatedRouter.snapshot.queryParams["oobCode"]
      }

      this.usuarioService.confirmEmailVerification(body)
        .subscribe(resp => {
          console.log("confirm email:", resp);
          if (resp["emailVerified"]) {

            /*=============================================
                Actualizar Confirmación de correo en Database
                =============================================*/

            this.usuarioService.getFilterData("email", resp["email"])
              .subscribe(resp => {
                console.log("user:", resp);
                for (const i in resp) {

                  let id = Object.keys(resp).toString();

                  let value = {

                    confirmar_correo: true
                  }

                  this.usuarioService.update(id, value)
                    .subscribe(resp => {

                      if (resp["confirmar_correo"]) {

                        Sweetalert.fnc("success-confirm", "¡Correo confirmado, Inicie sesión!", "login")
                      }

                    })

                }

              })

          }

        }, err => {

          if (err.error.error.message == "INVALID_OOB_CODE") {

            Sweetalert.fnc("error", "El correo ya ha sido confirmado", "login")

          }


        })

    }

  }

  changePassword() {
    /*=============================================
    Confirmar cambio de contraseña
    =============================================*/

    if (this.activatedRouter.snapshot.queryParams["oobCode"] != undefined &&
      this.activatedRouter.snapshot.queryParams["mode"] == "resetPassword") {

      let body = {

        oobCode: this.activatedRouter.snapshot.queryParams["oobCode"]
      }

      this.usuarioService.verifyPasswordResetCode(body)
        .subscribe(resp => {
          console.log("change_password:", resp);
          if (resp["requestType"] == "PASSWORD_RESET") {

            $("#newPassword").modal()

          }

        })

    }

  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],
      recuerdame: [''],
      email_forgot: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      password_reset: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],

    });
  }

  validatorErrorField(field) {
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }

  setValues() {
    this.usuario.email = this.form.controls['email'].value;
    this.usuario.password = this.form.controls['password'].value;
    this.recuerdame = this.form.controls['recuerdame'].value;
  }



  onSubmit() {
    // console.log(f);
    // console.log(this.usuario);
    if (this.form.controls['email'].valid && this.form.controls['password'].valid) {
      Sweetalert.fnc("loading", "Cargando ... ", null);

      this.usuarioService.getFilterData("email", this.usuario.email).subscribe(res1 => {
        console.log(res1);
        
        for (const i in res1) {
          if (res1[i].confirmar_correo) {

            this.setValues();
            this.usuario.return_secure_token = true;
            this.usuarioService.loginAuth(this.usuario).subscribe(res2 => {
              console.log(res2);

              let id = Object.keys(res1).toString();

              let value = {
                idToken: res2['idToken']
              }

              this.usuarioService.update(id, value).subscribe(res3 => {
                if (res3['idToken'] != '') {
                  Sweetalert.fnc("close", null, null);
                  localStorage.setItem("idToken", res3['idToken']);
                  localStorage.setItem("email", res2['email']);
                  let today = new Date();
                  today.setSeconds(res2['expiresIn']);
                  localStorage.setItem("expiresIn", today.getTime().toString());

                  //almacenamos recuerdame en el storage
                  console.log("recuerdame:", this.recuerdame);
                  if (!this.recuerdame) {
                    localStorage.setItem("rememberMe", "no");
                  } else {
                    localStorage.setItem("rememberMe", "yes");
                  }
                  this.storeService.getFilterData('username',res1[i].username).subscribe(respTienda=>{
                    if (Object.keys(respTienda).length > 0) {
                      // window.open('cuenta-usuario/cuenta/mi-tienda', '_top');
                      this.router.navigate(['/cuenta-usuario/cuenta/mi-tienda']);
                    } else {
                      this.router.navigate(['/cuenta-usuario/cuenta']);
                    }
                  });
                }
              })


            }, err => {
              (err.error.error.message == 'EMAIL_NOT_FOUND') ? Sweetalert.fnc("error", err.error.error.message == 'EMAIL_NOT_FOUND' ? 'El correo o la contraseña son incorrectas' : '', null)
                : Sweetalert.fnc("error", err.error.error.message == 'INVALID_PASSWORD' ? 'El correo  o la contraseña son incorrectas' : '', null);
            });
          } else {
            Sweetalert.fnc("error", "Necesita confirmar su correo electrónico(revise el spam)", null);
          }


        }






      });

    } else {
      return
    }


  }

  reestablecerPassword() {
    if (this.form.controls['email_forgot'].valid) {
      Sweetalert.fnc('loading', 'Cargando...', null);
      let body = {
        requestType: "PASSWORD_RESET",
        email: this.form.controls['email_forgot'].value
      }

      this.usuarioService.sendPasswordResetEmail(body).subscribe(res => {
        console.log("reestablecer:", res);
        Sweetalert.fnc('success', 'Revisa tu correo para cambiar tu contraseña', "login");

      })
    } else {
      return;
    }

  }

  newPassword() {
    if (this.form.controls['password_reset'].valid) {
      if (this.form.controls['password_reset'].value != "") {

        Sweetalert.fnc("loading", "Cargando...", null)

        let body = {

          oobCode: this.activatedRouter.snapshot.queryParams["oobCode"],
          newPassword: this.form.controls['password_reset'].value

        }

        this.usuarioService.confirmPasswordReset(body)
          .subscribe(resp => {
            console.log("confirmar_cambio_contraseña:", resp);
            if (resp["requestType"] == "PASSWORD_RESET") {

              Sweetalert.fnc("success", "Contraseña cambiada correctamente,Iniciar sesión nuevamente!", "login")

            }

          })

      }
    } else {
      return;
    }


  }

  googleLogin() {

    let localUsersService = this.usuarioService;
    let localUser = this.usuario;
    let localStoreService = this.storeService;

    // var provider = new firebase.auth.GoogleAuthProvider();

    /*=============================================
    acceder con una ventana emergente 
    =============================================*/

    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(function (result) {

      loginFirebaseDatabase(result, localUser, localUsersService, localStoreService)

    }).catch(function (error) {

      var errorMessage = error.message;

      Sweetalert.fnc("error", errorMessage, "login");

    });

    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function loginFirebaseDatabase(result, localUser, localUsersService: UsuarioService, localStoreService: TiendaService) {

      var user = result.user;
      console.log("usuario:", user);
      if (user.P) {

        localUsersService.getFilterData("email", user.email)
          .subscribe(resp => {
            // console.log("localusersevice:",resp);
            if (Object.keys(resp).length > 0) {

              if (resp[Object.keys(resp)[0]].metodo_registro == "google") {

                /*=============================================
                Actualizamos el idToken en Firebase
                =============================================*/

                let id = Object.keys(resp).toString();

                let body = {

                  idToken: user.b.b.i
                }
                console.log("id_token:", body.idToken);
                localUsersService.update(id, body)
                  .subscribe(resp => {

                    /*=============================================
                    Almacenamos el Token de seguridad en el localstorage
                    =============================================*/

                    localStorage.setItem("idToken", user.b.b.i);

                    /*=============================================
                    Almacenamos el email en el localstorage
                    =============================================*/

                    localStorage.setItem("email", user.email);

                    /*=============================================
                    Almacenamos la fecha de expiración localstorage
                    =============================================*/

                    let today = new Date();

                    today.setSeconds(3600);

                    localStorage.setItem("expiresIn", today.getTime().toString());

                    /*=============================================
                    Redireccionar al usuario a la página de su cuenta
                    =============================================*/
                    let username = user.email.split('@')[0];
                    console.log("username",username);
                    localStoreService.getFilterData('username',username).subscribe(respTienda=>{
                      console.log("respTienda:",respTienda);
                      if (Object.keys(respTienda).length > 0) {
                        // window.open('cuenta-usuario/cuenta/mi-tienda', '_top');
                        // this.router.navigate(['/cuenta-usuario/cuenta/mi-tienda']);
                        window.open("/cuenta-usuario/cuenta/mi-tienda", "_top");

                      } else {
                        window.open("/cuenta-usuario/cuenta", "_top");
                      }
                    });

                    // this.router:Router;
                    // this.router.navigate(['/cuenta-usuario/cuenta']);

                  })

              } else {

                Sweetalert.fnc("error", `Inicie sesión con el método de google`, "login")
              }

            } else {

              Sweetalert.fnc("error", "Esta cuenta no esta registrada", "registro")

            }


          })


      }
    }

  }


  facebookLogin() {

    let localUsersService = this.usuarioService;
    let localUser = this.usuario;


    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider).then(function (result) {
      loginFirebaseDatabase(result, localUser, localUsersService)

    }).catch(function (error) {

      var errorMessage = error.message;

      Sweetalert.fnc("error", errorMessage, "login");

    });

    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function loginFirebaseDatabase(result, localUser, localUsersService) {

      var user = result.user;

      if (user.P) {

        localUsersService.getFilterData("email", user.email)
          .subscribe(resp => {

            if (Object.keys(resp).length > 0) {

              if (resp[Object.keys(resp)[0]].metodo_registro == "facebook") {

                /*=============================================
                Actualizamos el idToken en Firebase
                =============================================*/

                let id = Object.keys(resp).toString();

                let body = {

                  idToken: user.b.b.g
                }

                localUsersService.patchData(id, body)
                  .subscribe(resp => {

                    /*=============================================
                    Almacenamos el Token de seguridad en el localstorage
                    =============================================*/

                    localStorage.setItem("idToken", user.b.b.g);

                    /*=============================================
                    Almacenamos el email en el localstorage
                    =============================================*/

                    localStorage.setItem("email", user.email);

                    /*=============================================
                    Almacenamos la fecha de expiración localstorage
                    =============================================*/

                    let today = new Date();

                    today.setSeconds(3600);

                    localStorage.setItem("expiresIn", today.getTime().toString());

                    /*=============================================
                    Redireccionar al usuario a la página de su cuenta
                    =============================================*/

                    window.open("account", "_top");


                  })

              } else {

                Sweetalert.fnc("error", `You're already signed in, please login with ${resp[Object.keys(resp)[0]].method} method`, "login")
              }

            } else {

              Sweetalert.fnc("error", "This account is not registered", "register")

            }


          })


      }
    }

  }

  


}
