import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { GrupoService } from 'src/app/core/grupo/grupo.service';
import { Categoria } from 'src/app/models/categoria';
import { environment } from 'src/environments/environment';
import { Sweetalert, Capitalize, CreateUrl } from '../../../functions';

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.css']
})
export class CategoriaModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  server: string = environment.server;
  categoria: Categoria;
  grupos: any[] = [];
  constructor(
    public bsModalRefAdd: BsModalRef,
    private categoriaService: CategoriaService,
    private grupoService: GrupoService,
    private http: HttpClient
  ) {
    this.categoria = new Categoria();
    this.onClose = new Subject();
  }

  tags: any[] = [];
  imageCategoria: File = null;;

  ngOnInit(): void {

  }

  validate(input) {

    /*=============================================
    Validamos el nombre de la subcategoria
    =============================================*/

    if ($(input).attr("name") == "nombre") {

      /*=============================================
     Validamos expresión regular del nombre de la tienda
     =============================================*/

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      } else {

        /*=============================================
        Validamos que el nombre del producto no esté repetido
        =============================================*/
        this.categoriaService.getByFilter("nombre", input.value)
          .subscribe(resp => {

            if (Object.keys(resp).length > 0) {

              $(input).parent().addClass('was-validated');
              input.value = "";
              this.categoria.url = "";

              Sweetalert.fnc("error", "El nombre de la categoria ya existe", null)

              return;

            } else {

              /*=============================================
             Capitulamos el nombre del producto
             =============================================*/

              input.value = Capitalize.fnc(input.value);
              this.categoria.nombre = Capitalize.fnc(input.value);
              /*=============================================
              Creamos la URL del producto
              =============================================*/

              this.categoria.url = CreateUrl.fnc(input.value);

            }

          })



      }


    }

  }

  /*=============================================
  Validación para las imágenes del formulario
  =============================================*/

  validateImage(e, tagPicture) {

    this.imageCategoria = e.target.files[0];


    let image = e.target.files[0];

    /*=============================================
    Validamos el formato
    =============================================*/

    if (image["type"] !== "image/jpeg" && image["type"] !== "image/png") {

      Sweetalert.fnc("error", "The image must be in JPG or PNG format", null)

      return;
    }

    /*=============================================
    Validamos el tamaño
    =============================================*/

    else if (image["size"] > 2000000) {

      Sweetalert.fnc("error", "Image must not weigh more than 2MB", null)

      return;
    }

    /*=============================================
    Mostramos la imagen temporal
    =============================================*/

    else {

      let data = new FileReader();
      data.readAsDataURL(image);

      $(data).on("load", function (event) {

        let path: any;
        path = event.target.result;

        $(`.${tagPicture}`).attr("src", path)

      })

    }
  }

  onSubmitCategoria(f: NgForm) {
    console.log("f:", f);
    let formCategoria = $(".formSubcategoria");

    for (let i = 0; i < formCategoria.length; i++) {

      if ($(formCategoria[i]).val() == "" || $(formCategoria[i]).val() == undefined) {

        $(formCategoria[i]).parent().addClass("was-validated")

      }
    }

    if (this.tags.length == 0) {

      Sweetalert.fnc("error", "La lista de etiquetas esta vacia", null);

      return;

    }


    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;
    }

    let folder = "";
    folder = this.categoria.url;
    const formData = new FormData();

    formData.append('file', this.imageCategoria);
    formData.append('folder', folder);
    formData.append('path', 'products/categorias');
    formData.append('width', '170');
    formData.append('height', '170');

    this.http.post(this.server, formData).subscribe(resp => {

      if (resp["status"] != null && resp["status"] == 200) {
        this.categoria.imagen = resp["result"];
      }

      let newTags = [];

      for (const i in this.tags) {

        if (this.tags[i].value != undefined) {

          newTags.push(Capitalize.fnc(this.tags[i].value));
          let grupo = {
            "categoria": this.categoria.nombre,
            "nombre": Capitalize.fnc(this.tags[i].value)
          }
          this.grupoService.registerDatabase(grupo, localStorage.getItem('token_auth')).subscribe(resp => {
            console.log("grupo_resp:", resp);

          });
        } else {

          newTags.push(Capitalize.fnc(this.tags[i]));
        }

      }

      this.categoria.grupo = JSON.stringify(newTags);
      this.categoria.vistas = 0;
      this.categoriaService.registerDatabase(this.categoria, localStorage.getItem('token_auth')).subscribe(resp => {
        console.log('resp_categoria:', resp);
        Sweetalert.fnc('success', 'Se ha registrado la categoria con éxito', null);
        this.bsModalRefAdd.hide();
        this.onClose.next(true);

      });
    });




  }

}
