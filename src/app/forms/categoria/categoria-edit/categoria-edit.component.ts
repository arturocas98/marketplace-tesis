import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { GrupoService } from 'src/app/core/grupo/grupo.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { environment } from 'src/environments/environment';
import { Sweetalert, Capitalize } from '../../../functions';

@Component({
  selector: 'app-categoria-edit',
  templateUrl: './categoria-edit.component.html',
  styleUrls: ['./categoria-edit.component.css']
})
export class CategoriaEditComponent implements OnInit {

  @Input() categoria_id: string;
  categoria: Categoria;
  feedback: any[] = [];
  form: FormGroup;
  color: ThemePalette = 'accent';
  checked: boolean = false;
  type: any;
  tags: any[] = [];
  path: string = environment.url_image;
  imageCategoria: File = null;
  server: string = environment.server;
  serverDelete: string = environment.serverDelete;
  textGroup: string = "grupo..";
  textGroup2: string = "Ingrese un nuevo grupo";
  grupos: any[] = [];
  // comment:any;
  public onClose: Subject<boolean>;
  constructor(
    private productsService: CategoriaService,
    public bsModalRefEdit: BsModalRef,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private grupoService: GrupoService

  ) {
    this.categoria = new Categoria();
  }

  ngOnInit(): void {
    this.editProduct();
    this.onClose = new Subject();
  }



  editProduct() {
    this.productsService.getById(this.categoria_id).subscribe(resp => {
      this.categoria.nombre = resp['nombre'];
      this.categoria.url = resp['url'];
      // this.categoria.grupo = resp['grupo'];
      this.categoria.imagen = resp['imagen'];
      this.categoria.grupo = JSON.parse(resp['grupo']);
      JSON.parse(resp["grupo"]).forEach(item => {

        this.tags.push(item)
        this.grupos.push(item);
      })

    });
  }


  validateImage(e, tagPicture) {

    this.imageCategoria = e.target.files[0];
    console.log("imagen:", this.imageCategoria);


    let image = e.target.files[0];

    /*=============================================
    Validamos el formato
    =============================================*/

    if (image["type"] !== "image/jpeg" && image["type"] !== "image/png") {

      Sweetalert.fnc("error", "La imagen debe estar en formato png o jpg", null)

      return;
    }

    /*=============================================
    Validamos el tamaño
    =============================================*/

    else if (image["size"] > 2000000) {

      Sweetalert.fnc("error", "La imagen no debe ser mayor a  2MB", null)

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



  onSubmitProduct(f: NgForm) {
    // event.preventDefault();
    let formProduct = $(".formCategoria");


    for (let i = 0; i < formProduct.length; i++) {

      if ($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined) {

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }

    if (this.tags.length == 0) {

      Sweetalert.fnc("error", "La lista de grupos esta vacía", null);

      return;

    }



    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;
    }

    Sweetalert.fnc("loading", "Cargando...", null);


    let folder = "";
    folder = this.categoria.url;

    let allImages = [

      {
        file: this.imageCategoria,
        folder: folder,
        path: 'products/categorias',
        width: '170',
        height: '170'
      },
    ];

    for (const i in allImages) {
      const formData = new FormData();

      formData.append('file', allImages[i].file);
      formData.append('folder', allImages[i].folder);
      formData.append('path', allImages[i].path);
      formData.append('width', allImages[i].width);
      formData.append('height', allImages[i].height);

      this.http.post(this.server, formData).subscribe(resp => {
        console.log("respuesta:", resp);
        if (resp["status"] != null && resp["status"] == 200) {
          /*=============================================
          Borrar antigua imagen del servidor
          =============================================*/

          const formData = new FormData();

          let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.categoria.imagen}`;

          formData.append("fileDelete", fileDelete);

          this.http.post(this.serverDelete, formData)
            .subscribe(resp => { })

          this.categoria.imagen = resp["result"];
          console.log("imagen de la categoria:",this.categoria.imagen);
          

        }
      });

      let newTags = [];

      for (const i in this.tags) {
        // console.log("entro");
        if (this.tags[i].value != undefined) {
          newTags.push(Capitalize.fnc(this.tags[i].value));
          let grupo = {
            "categoria": this.categoria.nombre,
            "nombre": Capitalize.fnc(this.tags[i].value)
          }
          this.grupoService.registerDatabase(grupo, localStorage.getItem('token_auth')).subscribe(resp => {
            // console.log("grupo_resp:", resp);

          });


        } else {

          newTags.push(this.tags[i]);
        }

      }
      if (newTags.length > 0) {
        this.grupos.forEach(item => {
          this.grupoService.getByFilter('nombre', item).subscribe(resp => {
            // console.log("filter_grupos:", resp);
            for (const j in resp) {
              // this.idCategorias = Object.keys(resp).toString().split(",");
              this.grupoService.deleteDataAuth(j, localStorage.getItem('token_auth')).subscribe(respuesta => {
                console.log("respuesta_delete:", respuesta);

              });

            }
          });

        });
      }

      this.categoria.grupo = JSON.stringify(newTags).toLowerCase();
      console.log("categoria:", this.categoria);

      this.productsService.patchDataAuth(this.categoria_id, this.categoria, localStorage.getItem('token_auth')).subscribe(resp => {
        // console.log("resp:",resp);
        Sweetalert.fnc('success', 'La categoría ha sido actualizada', null);
        this.onClose.next(true);
        this.bsModalRefEdit.hide();
      })
    }


  }

}
