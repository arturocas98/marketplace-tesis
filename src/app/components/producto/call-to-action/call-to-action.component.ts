import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {
  path: string = environment.url_image;
  call_to_action: Array<any> = [];
  price: Array<any> = [];
  constructor(
    private activateRoute: ActivatedRoute,
    private productsService: ProductoService
  ) { }

  ngOnInit(): void {

    this.productsService.getByFilter("url", this.activateRoute.snapshot.params["param"]).subscribe(res => {
      for (const i in res) {
        this.call_to_action.push(res[i]);

        this.call_to_action.forEach(response => {

          let type;
          let value;
          let offer;

          if (response.oferta != "") {

            type = JSON.parse(response.oferta)[0];
            value = JSON.parse(response.oferta)[1];

            if (type == "Descuento") {

              offer = (response.precio - (response.precio * value / 100)).toFixed(2)
            }

            if (type == "Fijo") {

              offer = value;

            }

            this.price.push(`<span class="ps-product__price">

              <span>$${offer}</span>

              <del>$${response.precio}</del>

            </span>`);

          } else {

            this.price.push(`<span class="ps-product__price">

              <span>$${response.precio}</span>

            </span>`);
          }

        })
      }
      console.log(this.call_to_action);
    });
  }

}
