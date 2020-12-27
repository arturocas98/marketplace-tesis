import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MyValidators } from '../utils/MyValidators';
import { Capitalize, Sweetalert } from '../../functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(
    public usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
    public activatedRouter: ActivatedRoute,
    public router: Router,

  ) {
    this.usuario = new Usuario();
    this.validators = new MyValidators();


  }

  ngOnInit(): void {
    this.needValidation = this.validators.needValidation();
    this.initForm();
    this.confirmarCorreo();



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

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],

    });
  }

  validatorErrorField(field) {
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }

  setValues() {
    this.usuario.email = this.form.controls['email'].value;
    this.usuario.password = this.form.controls['password'].value;

  }

  onSubmit() {
    // console.log(f);
    // console.log(this.usuario);
    if (this.form.valid) {
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

              this.usuarioService.update(id,value).subscribe(res3=>{
                if (res3['idToken'] != '' ) {
                  Sweetalert.fnc("close", null, null);
                  localStorage.setItem("idToken",res3['idToken']);
                  localStorage.setItem("email",res2['email']);
                  let today = new Date();
                  today.setSeconds(res2['expiresIn']);
                  localStorage.setItem("expiresIn",today.getTime().toString());
                  this.router.navigate(['/cuenta-usuario/cuenta']);

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

  // onSubmit() {

  //   if (this.form.invalid) {

  //     return;

  //   }

  //   /*=============================================
  //     Alerta suave mientras se registra el usuario
  //     =============================================*/

  //   Sweetalert.fnc("loading", "Loading...", null)

  //   /*=============================================
  //     Validar que el correo esté verificado
  //   =============================================*/

  //   this.usuarioService.getFilterData("email", this.usuario.email)
  //     .subscribe(resp1 => {
  //       console.log("resp1:", resp1);
  //       for (const i in resp1) {

  //         if (resp1[i].confirmar_correo) {

  //           /*=============================================
  //         Login en Firebase Authentication
  //         =============================================*/

  //           this.setValues();

  //           this.usuarioService.loginAuth(this.usuario)
  //             .subscribe(resp2 => {
  //               console.log("resp2:", resp2);
  //               /*=============================================
  //               Almacenar id Token en Firebase Database
  //               =============================================*/

  //               let id = Object.keys(resp1).toString();

  //               let value = {

  //                 idToken: resp2["idToken"]
  //               }

  //               this.usuarioService.update(id, value)
  //                 .subscribe(resp3 => {
  //                   console.log("resp3:", resp3);
  //                   console.log("expire in:",resp2["exp"]);

  //                   if (resp3["idToken"] != "") {

  //                     Sweetalert.fnc("close", null, null)

  //                     /*=============================================
  //                   Almacenamos el Token de seguridad en el localstorage
  //                   =============================================*/

  //                     localStorage.setItem("idToken", resp3["idToken"]);

  //                     /*=============================================
  //                     Almacenamos el email en el localstorage
  //                     =============================================*/

  //                     localStorage.setItem("email", resp2["email"]);

  //                     /*=============================================
  //                     Almacenamos la fecha de expiración localstorage
  //                     =============================================*/

  //                     let today = new Date();

  //                     today.setSeconds(resp2["expiresIn"]);

  //                     localStorage.setItem("expiresIn", today.getTime().toString());

  //                     /*=============================================
  //                     Almacenamos recordar email en el localStorage
  //                     =============================================*/

  //                     // if(this.rememberMe){

  //                     // 	localStorage.setItem("rememberMe", "yes");

  //                     // }else{

  //                     // 	localStorage.setItem("rememberMe", "no");
  //                     // }


  //                     /*=============================================
  //                     Redireccionar al usuario a la página de su cuenta
  //                     =============================================*/

  //                     // this.router.navigate(['/cuenta-usuario/cuenta']);

  //                   }

  //                 })

  //             }, err => {

  //               Sweetalert.fnc("error", err.error.error.message, null)

  //             })

  //         } else {

  //           Sweetalert.fnc("error", 'Necesita confirmar su correo', null)

  //         }

  //       }

  //     })

  // }

}
