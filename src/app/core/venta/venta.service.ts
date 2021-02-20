
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private url_api;
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
  }

  getAll(){
    let url = this.url_api+ "/venta.json"
    return this.http.get(url);
  }

  registerDatabase(body:Object,idToken:string) {
    return this.http.post(`${this.url_api}/venta.json?auth=${idToken}`, body);
  }

  /*=============================================
	Filtrado de datos
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${this.url_api}/venta.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	/*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.url_api}/venta/${id}.json?auth=${idToken}`,value);

	}
  

}
