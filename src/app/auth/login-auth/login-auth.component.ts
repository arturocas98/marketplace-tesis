import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyValidators } from 'src/app/components/utils/MyValidators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { Sweetalert } from '../../functions';

@Component({
  selector: 'app-login-auth',
  templateUrl: './login-auth.component.html',
  styleUrls: ['./login-auth.component.css']
})
export class LoginAuthComponent implements OnInit {

  form: FormGroup;
  public validators: MyValidators;
  private usuario: Usuario;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.validators = new MyValidators();
    this.usuario = new Usuario();
  }

  ngOnInit() {
    this.buildForm();
  }

  login(event: Event) {
    event.preventDefault();
    // console.log(this.form.value);
    if (this.form.valid) {
      const value = this.form.value;
      this.usuario.email = value.email;
      this.usuario.password = value.password;
      this.usuario.return_secure_token = true;
      Sweetalert.fnc('loading', 'Cargando...', null)
      this.usuarioService.loginAuth(this.usuario).subscribe(
        resp => {
          // console.log("usuario resp:", resp['email']);
          if (resp['email'] != 'admin@hotmail.com') {
            Sweetalert.fnc('error', 'No está habilitado para ingresar al panel de administración', null)
          } else {
            console.log("token_auth:",resp['idToken']);
            localStorage.setItem('token_auth',resp['idToken']);
            localStorage.setItem('email_auth', resp['email']);
            this.router.navigate(['/admin']);
            Sweetalert.fnc('close');
          }
        }, err => {
          Sweetalert.fnc('error', 'Contraseña o usuario incorrecto', null)
        }
      );
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],
    });
  }

  validatorErrorField(field) {
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }



}
