import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';

@Component({
  selector: 'app-cuenta-breadcrumb',
  templateUrl: './cuenta-breadcrumb.component.html',
  styleUrls: ['./cuenta-breadcrumb.component.css']
})
export class CuentaBreadcrumbComponent implements OnInit {
  public displayName:string;
  constructor(
    private usuarioService:UsuarioService
  ){
    this.displayName = "";
  }

  ngOnInit(): void {
  }
  /*=============================================
		Validar si existe usuario autenticado
		=============================================*/
  validUserAuth(){
    this.usuarioService.authActivate().then(resp =>{

			if(resp){

				this.usuarioService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{

					for(const i in resp){

						this.displayName = resp[i].displayName;

					}

				})

			}

		})
  }

  logout(){

		localStorage.removeItem('idToken');
    	localStorage.removeItem('expiresIn');
    	window.open('login', '_top')

	}

}
