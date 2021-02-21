import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Mensaje } from 'src/app/models/mensaje';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class MensajeService {

    private api: string = environment.url_api;

    constructor(private http: HttpClient) { }

    /*=============================================
Registro en Firebase Database
=============================================*/

    registerDatabase(body: Mensaje, idToken: string) {

        return this.http.post(`${this.api}/mensaje.json?auth=${idToken}`, body);

    }

    /*=============================================
    Actualizar en Firebase Database
    =============================================*/

    patchDataAuth(id: string, value: object, idToken: string) {

        return this.http.patch(`${this.api}/mensaje/${id}.json?auth=${idToken}`, value);

    }

    /*=============================================
    Filtrado de datos
    =============================================*/

    getFilterData(orderBy: string, equalTo: string) {

        return this.http.get(`${this.api}/mensaje.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

    }
}
