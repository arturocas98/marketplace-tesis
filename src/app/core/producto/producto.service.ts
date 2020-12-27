
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url_api;
  constructor(
    private http: HttpClient 
  ) {
    this.url_api = environment.url_api;
  }

  getAll(){
    let url = this.url_api+ "/producto.json"
    return this.http.get(url);
  }

  getLimit(startAt:string,limitToFirst:number){
    let url = this.url_api+ `/producto.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty`;
    return this.http.get(url);
  }

  getByFilter(order:string,equal:string){
    let url = this.url_api+ `/producto.json?orderBy="${order}"&equalTo="${equal}"&print=pretty`;
    return this.http.get(url);
  }

  getByFilterLimit(order:string,equal:string,limitToFirst:number){
    let url = this.url_api+ `/producto.json?orderBy="${order}"&equalTo="${equal}"&limitToFirst=${limitToFirst}&print=pretty`;
    return this.http.get(url);
  }
}
