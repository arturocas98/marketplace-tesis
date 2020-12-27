import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MyValidators } from '../utils/MyValidators';
import { Capitalize, Sweetalert } from '../../functions';
// import * as firebase from "firebase/app";
import firebase from "firebase/app";

import  "firebase/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

declare var $;
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public usuario: Usuario;

  public form: FormGroup;
  public validators: MyValidators;
  public needValidation: any;
  constructor(
    public usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth
  ) {
    this.usuario = new Usuario();
    this.validators = new MyValidators();
   
  }

  ngOnInit(): void {
    this.needValidation = this.validators.needValidation();

    this.initForm();
    // console.log("console.log:",resp);

  }



  initForm() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      username: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],

    });
  }

  capitalize(input) {

    input.value = Capitalize.fnc(input.value)

  }

  setValues() {
    this.usuario.nombres = this.form.controls['nombres'].value;
    this.usuario.apellidos = this.form.controls['apellidos'].value;
    this.usuario.email = this.form.controls['email'].value;
    this.usuario.username = this.form.controls['username'].value;
    this.usuario.password = this.form.controls['password'].value;

  }

  onSubmit() {
    // console.log(f);
    // console.log(this.usuario);
    if (this.form.valid) {
      // const user = this.form.value;
      Sweetalert.fnc("loading", "Cargando ... ", null);
      this.usuarioService.getFilterData("username", this.form.controls['username'].value).subscribe(res => {
        console.log("username:", res);
        if (Object.keys(res).length > 0) {


          // Sweetalert.fnc();
          Sweetalert.fnc("error", "El nombre de usuario ya existe en la base de datos", null);
          return;
        } else {
          this.setValues();
          this.usuario.return_secure_token = true;
          this.usuarioService.registerAuth(this.usuario).subscribe(res => {
            if (res["email"] == this.usuario.email) {
              let body = {
                requestType: "VERIFY_EMAIL",
                idToken: res["idToken"]
              }
              this.usuarioService.sendEmailVerification(body).subscribe(res => {
                console.log("email-verification:",res);
                if (res["email"] == this.usuario.email) {
                  this.usuario.displayName = `${this.usuario.nombres} ${this.usuario.apellidos} `;
                  this.usuario.metodo_registro = 'direct';
                  this.usuario.idToken = res['idToken'];
                  this.usuario.confirmar_correo = false;
                  this.usuarioService.registerDatabase(this.usuario).subscribe(res => {

                    this.usuario = new Usuario();
                    this.initForm();
                    Sweetalert.fnc("success", "Confirma tu cuenta en tu correo electrónico(revisa el spam)", "login");

                  });
                }


              })

            }
          }, err => {
            Sweetalert.fnc("error", err.error.error.message == 'EMAIL_EXISTS' ? 'El email ya se encuentra registrado' : '', null);
          })

        }
      });

    } else {
      Sweetalert.fnc("error", "Llene todos los campos requeridos", null);
    }

  }

  validatorErrorField(field) {
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }

  googleRegister(){

    // https://firebase.google.com/docs/web/setup
    // Crea una nueva APP en Settings
    // npm install --save firebase
    // Agregar import * as firebase from "firebase/app";
    // import "firebase/auth";

    /*=============================================
    Inicializa Firebase en tu proyecto web
    =============================================*/

    

    // Initialize Firebase
    firebase.initializeApp(environment.firebase);
  
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider);

    

  }

}
