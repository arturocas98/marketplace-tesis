import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private url_api;
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
  }

  registerDatabase(body:Object,idToken:string) {
    return this.http.post(`${this.url_api}/orden.json?auth=${idToken}`, body);
  }

  getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${this.url_api}/orden.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

  /*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.url_api}/orden/${id}.json?auth=${idToken}`,value);

	}

}
