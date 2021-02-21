import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Disputa } from 'src/app/models/disputa';

@Injectable({
  providedIn: 'root'
})

export class DisputaService {

	private api:string = environment.url_api;

  	constructor(private http:HttpClient) { }

  	/*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(body:Disputa, idToken:string){

		return this.http.post(`${this.api}/disputa.json?auth=${idToken}`, body);

	}

	/*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.api}/disputa/${id}.json?auth=${idToken}`,value);

	}

	/*=============================================
	Filtrado de datos
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${this.api}/disputa.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

}
