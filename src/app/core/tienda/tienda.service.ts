import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tienda } from 'src/app/models/tienda';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private api:String = environment.url_api;

  constructor(private http:HttpClient) { }

  getData(){

		return this.http.get(`${this.api}/tienda.json`);

  }
  

  getFilterData(orderBy:String, equalTo:String){

		return this.http.get(`${this.api}/tienda.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

  /*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(body: Tienda, idToken:string){

		return this.http.post(`${this.api}/tienda.json?auth=${idToken}`, body);

	}

	/*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:Tienda, idToken:string){

		return this.http.patch(`${this.api}/tienda/${id}.json?auth=${idToken}`,value);

	}

}
