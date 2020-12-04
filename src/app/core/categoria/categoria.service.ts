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
}
