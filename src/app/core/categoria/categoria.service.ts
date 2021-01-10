import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url_api;
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
  }

  getAll(){
    let url = this.url_api+ "/categoria.json"
    return this.http.get(url);
  }

  getByFilter(order,equal){
    let url = this.url_api+ `/categoria.json?orderBy="${order}"&equalTo="${equal}"&print=pretty`;
    return this.http.get(url);
  }

  patchData(id:String, value:Object){

		return this.http.patch(`${this.url_api}/categoria/${id}.json`,value);

	}
}
