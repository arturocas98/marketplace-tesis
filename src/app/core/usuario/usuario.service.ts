
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public url_api;
  public register;
  
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
    this.register = environment.register;
  }

  registerAuth(usuario:Usuario){
    return this.http.post(this.register,usuario);
  }

  registerDatabase(usuario:Usuario){
    delete usuario.password;
    delete usuario.token;
    return this.http.post(`${this.url_api}/usuario.json`,usuario);
  }

 
}
