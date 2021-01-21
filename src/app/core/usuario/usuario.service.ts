
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import {Sweetalert } from '../../functions';

declare var jQuery:any;
declare var $:any;
@Injectable({
  providedIn: 'root'
})


export class UsuarioService {
  private url_api;
  private register;
  private login;
  private sendEmail;
  private confirmEmail;
  private getUserData;
  private SendPasswordResetEmail;
  private confirmChangePassword;
  private sendNewPassword;
  private changePassword;
  constructor(
    private http: HttpClient
  ) {
    this.url_api = environment.url_api;
    this.register = environment.register;
    this.login = environment.login;
    this.sendEmail = environment.sendEmailVerification;
    this.confirmEmail = environment.confirmEmailVerification;
    this.getUserData = environment.getUserData;
    this.SendPasswordResetEmail = environment.SendPasswordResetEmail;
    this.confirmChangePassword = environment.VerifyPasswordResetCode;
    this.sendNewPassword = environment.ConfirmPasswordReset;
    this.changePassword = environment.ChangePassword;
  }

  getAll() {
    let url = this.url_api + "/usuario.json"
    return this.http.get(url);
  }


  registerAuth(usuario: Usuario) {
    return this.http.post(this.register, usuario);
  }

  registerDatabase(usuario: Usuario) {
    delete usuario.password;
    delete usuario.return_secure_token;
    return this.http.post(`${this.url_api}/usuario.json`, usuario);
  }

  /*=============================================
    Filtrar data para buscar coincidencias
    =============================================*/

  getFilterData(orderBy: string, equalTo: string) {

    return this.http.get(`${this.url_api}/usuario.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

  }

  loginAuth(usuario: Usuario) {

    return this.http.post(`${this.login}`, usuario);

  }

  sendEmailVerification(body: Object) {

    return this.http.post(`${this.sendEmail}`, body);

  }

  confirmEmailVerification(body: Object) {

    return this.http.post(`${this.confirmEmail}`, body);

  }

  update(id: string, value: object) {

    return this.http.patch(`${this.url_api}/usuario/${id}.json`, value);

  }

  authActivate() {

    return new Promise(resolve => {

      /*=============================================
        Validamos que el idToken sea real
        =============================================*/

      if (localStorage.getItem("idToken")) {

        let body = {

          idToken: localStorage.getItem("idToken")
        }

        this.http.post(`${this.getUserData}`, body)
          .subscribe(resp => {

            /*=============================================
              Validamos fecha de expiración
              =============================================*/

            if (localStorage.getItem("expiresIn")) {

              let expiresIn = Number(localStorage.getItem("expiresIn"));

              let expiresDate = new Date();
              expiresDate.setTime(expiresIn);

              if (expiresDate > new Date()) {

                resolve(true)

              } else {

                localStorage.removeItem('idToken');
                localStorage.removeItem('expiresIn');
                resolve(false)
              }

            } else {

              localStorage.removeItem('idToken');
              localStorage.removeItem('expiresIn');
              resolve(false)

            }


          }, err => {

            localStorage.removeItem('idToken');
            localStorage.removeItem('expiresIn');
            resolve(false)

          })

      } else {

        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresIn');
        resolve(false)
      }

    })

  }
  	/*=============================================
	Resetear la contraseña
	=============================================*/

  sendPasswordResetEmail(body:object){

    return this.http.post(`${this.SendPasswordResetEmail}`, body)

  }

  	/*=============================================
	Confirmar el cambio de la contraseña
  =============================================*/
  
  verifyPasswordResetCode(body:object){

    return this.http.post(`${this.confirmChangePassword}`, body)

  }

  /*=============================================
	Enviar la contraseña
	=============================================*/

  confirmPasswordReset(body:object){

    return this.http.post(`${this.sendNewPassword}`, body)

  }
  	/*=============================================
	Cambiar la contraseña
	=============================================*/
  changePasswordFnc(body:object){

    return this.http.post(`${this.changePassword}`, body)

  }

  getById(value:string){

    return this.http.get(`${this.url_api}/usuario/${value}.json`);
  }

  wishlist(producto){
    this.authActivate().then(res=>{
      if (!res) {
        Sweetalert.fnc('error',"Inicie sesión para agregar el producto a la lista de deseos ",null);
        return;
      }else{
        this.getFilterData('idToken',localStorage.getItem('idToken')).subscribe(resp=>{
            let id = Object.keys(resp).toString();
            for(const i in resp){
              if (resp[i].wishlist != undefined) {
                let wishlist = [];
                wishlist = JSON.parse(resp[i].wishlist);
                let length = 0;
                if (wishlist.length != 0) {
                  wishlist.forEach((list,index)=>{
                    if (list == producto) {
                      length --;
                    }else{
                      length ++;
                    }
                  });
                  if (length != wishlist.length) {
                    Sweetalert.fnc('error','Este producto ya existe en tu lista de deseos',null);
                  }else{
                    wishlist.push(producto);
                    let body = {
                      wishlist: JSON.stringify(wishlist)
                    }
                    this.update(id,body).subscribe(resp2=>{
                      if (resp2['wishlist'] != '' ) {
                        let totalWishlist = Number($(".totalWishlist").html());
                            
                        $(".totalWishlist").html(totalWishlist+1); 
                        Sweetalert.fnc("success",'El producto se ha añadido a la lista de deseos',null);
                      }
                    });
                  }
                }else{
                  wishlist.push(producto);
                  let body = {
                    wishlist: JSON.stringify(wishlist)
                  }
                  this.update(id,body).subscribe(resp2=>{
                    if (resp2['wishlist'] != '' ) {
                      let totalWishlist = Number($(".totalWishlist").html());
                            
                      $(".totalWishlist").html(totalWishlist+1); 
                      Sweetalert.fnc("success",'El producto se ha añadido a la lista de deseos',null);
                    }
                  })
                }
              }else{
                let body = {
                  wishlist: `["${producto}"]`
                }
                this.update(id,body).subscribe(resp2=>{
                  if (resp2['wishlist'] != '' ) {
                    let totalWishlist = Number($(".totalWishlist").html());
                            
                    $(".totalWishlist").html(totalWishlist+1); 
                    Sweetalert.fnc("success",'El producto se ha añadido a la lista de deseos',null);
                  }
                })
              }
            }
        });    
      }
    });
  }

}
