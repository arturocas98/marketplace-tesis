import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
