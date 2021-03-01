import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subcategoria } from 'src/app/models/subcategoria';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private url_api;
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
  }

  
  getAll(){

		return this.http.get(`${this.url_api}/subcategoria.json`);

  }
  

  getByFilter(order,equal){
    let url = this.url_api+ `/subcategoria.json?orderBy="${order}"&equalTo="${equal}"&print=pretty`;
    return this.http.get(url);
  }

  patchData(id:String, value:Object){

		return this.http.patch(`${this.url_api}/subcategoria/${id}.json`,value);

	}

  /*=============================================
  Registro en Firebase Database
  =============================================*/

  registerDatabase(body:Object,idToken:string) {
    return this.http.post(`${this.url_api}/subcategoria.json?auth=${idToken}`, body);
  }
}
