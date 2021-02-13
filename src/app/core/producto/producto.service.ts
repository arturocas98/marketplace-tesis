
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
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

  getAll() {
    let url = this.url_api + "/producto.json"
    return this.http.get(url).pipe(

      map((resp: any) => {

        let newResp = [];
        let count = 0;

        for (const i in resp) {

          count++;

          if (JSON.parse(resp[i].feedback).type == "approved") {

            newResp.push(resp[i]);

          }

        }

        if (count == Object.keys(resp).length) {

          return newResp;
        }

      })

    );
  }

  getLimit(startAt: string, limitToFirst: number) {
    let url = this.url_api + `/producto.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty`;
    return this.http.get(url).pipe(

      map((resp: any) => {

        let newResp = [];
        let count = 0;

        for (const i in resp) {

          count++;

          if (JSON.parse(resp[i].feedback).type == "approved") {

            newResp.push(resp[i]);

          }

        }

        if (count == Object.keys(resp).length) {

          return newResp;
        }

      })

    );
  }

  getByFilter(order: string, equal: string) {
    let url = this.url_api + `/producto.json?orderBy="${order}"&equalTo="${equal}"&print=pretty`;
    return this.http.get(url).pipe(

      map((resp: any) => {

        let newResp = [];
        let count = 0;

        for (const i in resp) {

          count++;

          if (JSON.parse(resp[i].feedback).type == "approved") {

            newResp.push(resp[i]);

          }

        }

        if (count == Object.keys(resp).length) {

          return newResp;
        }

      })

    );
  }

  getByFilterLimit(order: string, equal: string, limitToFirst: number) {
    let url = this.url_api + `/producto.json?orderBy="${order}"&equalTo="${equal}"&limitToFirst=${limitToFirst}&print=pretty`;
    return this.http.get(url).pipe(

      map((resp: any) => {

        let newResp = [];
        let count = 0;

        for (const i in resp) {

          count++;

          if (JSON.parse(resp[i].feedback).type == "approved") {

            newResp.push(resp[i]);

          }

        }

        if (count == Object.keys(resp).length) {

          return newResp;
        }

      })

    );
  }

  getSearchData(order: string, param: string) {
    return this.http.get(`${this.url_api}/producto.json?orderBy="${order}"&startAt="${param}"&endAt="${param}\uf8ff"&print=pretty`).pipe(

      map((resp: any) => {

        let newResp = [];
        let count = 0;

        for (const i in resp) {

          count++;

          if (JSON.parse(resp[i].feedback).type == "approved") {

            newResp.push(resp[i]);

          }

        }

        if (count == Object.keys(resp).length) {

          return newResp;
        }

      })

    );
  }

  patchData(id: String, value: Object) {

    return this.http.patch(`${this.url_api}/producto/${id}.json`, value);

  }

  getById(value: string) {

    return this.http.get(`${this.url_api}/producto/${value}.json`);
  }

  getFilterDataStore(orderBy:string, equalTo:string){

		return this.http.get(`${this.url_api}/producto.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)

	}

  patchDataAuth(id: String, value: Object, idToken: string) {

    return this.http.patch(`${this.url_api}/producto/${id}.json?auth=${idToken}`, value);

  }

  /*=============================================
  Registro en Firebase Database
  =============================================*/

  registerDatabase(body: Producto, idToken: string) {

    return this.http.post(`${this.url_api}/producto.json?auth=${idToken}`, body);

  }
}
