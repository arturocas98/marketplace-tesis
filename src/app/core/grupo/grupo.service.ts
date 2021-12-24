import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Grupo } from 'src/app/models/grupo';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GrupoService {
    private url_api;
    constructor(
        private http: HttpClient
    ) {
        this.url_api = environment.url_api;
    }

    registerDatabase(body: Object, idToken: string) {
        return this.http.post(`${this.url_api}/grupo.json?auth=${idToken}`, body);
    }

    getAll() {
        let url = this.url_api + "/grupo.json"
        return this.http.get(url);
    }


    getByFilter(order, equal) {
        let url = this.url_api + `/grupo.json?orderBy="${order}"&equalTo="${equal}"&print=pretty`;
        return this.http.get(url);
    }

    patchData(id: String, value: Object) {

        return this.http.patch(`${this.url_api}/grupo/${id}.json`, value);

    }

    deleteDataAuth(id:string, idToken:string){

		return this.http.delete(`${this.url_api}/grupo/${id}.json?auth=${idToken}`);

	}
}
