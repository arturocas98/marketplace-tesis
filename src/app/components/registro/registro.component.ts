import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MyValidators } from '../utils/MyValidators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public usuario: Usuario;
  public form: FormGroup;
  public validators:MyValidators;
  constructor(
    public usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
  ) {
    this.usuario = new Usuario();
    this.validators = new MyValidators();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      username: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9\s]*/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],

    });
  }

  setValues(){
    this.usuario.nombres = this.form.controls['nombres'].value;
		this.usuario.apellidos = this.form.controls['apellidos'].value;
    this.usuario.email = this.form.controls['email'].value;
		this.usuario.username = this.form.controls['username'].value;
		this.usuario.password = this.form.controls['password'].value;
    this.usuario.token = true;

  }

  onSubmit() {
    // console.log(f);
    // console.log(this.usuario);
    if (this.form.valid) {
      // const user = this.form.value;
      console.log("entro");
      this.setValues();
      this.usuarioService.registerAuth(this.usuario).subscribe(res => {
        if (res["email"] == this.usuario.email) {
          this.usuario.displayName = `${this.usuario.nombres} ${this.usuario.apellidos} `;
          this.usuario.metodo_registro = 'direct';
          this.usuario.idToken = res['idToken'];
          this.usuario.confirmar_correo = false;
          this.usuarioService.registerDatabase(this.usuario).subscribe(res => {
            console.log(res);
            this.usuario = new Usuario();
          });
        }
      })
    }else{
      console.log("Llene los campos correctamente!");
    }

  }

  validatorErrorField(field){
    // console.log(this.form);
    return this.validators.validatorErrorField(field, this.form);
  }


}
