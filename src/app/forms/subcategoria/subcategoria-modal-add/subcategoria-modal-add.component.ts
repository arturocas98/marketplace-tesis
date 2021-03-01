import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { GrupoService } from 'src/app/core/grupo/grupo.service';
import { Subcategoria } from 'src/app/models/subcategoria';
import { Sweetalert, Capitalize, CreateUrl } from '../../../functions';

@Component({
  selector: 'app-subcategoria-modal-add',
  templateUrl: './subcategoria-modal-add.component.html',
  styleUrls: ['./subcategoria-modal-add.component.css']
})
export class SubcategoriaModalAddComponent implements OnInit {
  subcategorias: any[] = [];
  subcategoria: Subcategoria;
  categorias: any[] = [];
  grupos: any[] = [];
  public onClose: Subject<boolean>;
  constructor(
    public bsModalRefAdd: BsModalRef,
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaService,
    private grupoService: GrupoService
  ) {
    this.subcategoria = new Subcategoria();
    this.onClose = new Subject();
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaService.getAll().subscribe(resp => {
      console.log("Respuesta:", resp);
      for (const i in resp) {
        this.categorias.push(resp[i]);
        // this.grupos.push(JSON.parse(resp[i].grupo));
      }
      // for (const j in this.grupos) {
      //   this.grupos.concat(this.grupos[j] - 1);
      // }

      // console.log("grupos:", this.grupos);
    });
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
        this.subcategoriaService.getByFilter("nombre", input.value)
          .subscribe(resp => {

            if (Object.keys(resp).length > 0) {

              $(input).parent().addClass('was-validated');
              input.value = "";
              this.subcategoria.url = "";

              Sweetalert.fnc("error", "El nombre de la subcategoría ya existe", null)

              return;

            } else {

              /*=============================================
             Capitulamos el nombre del producto
             =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL del producto
              =============================================*/

              this.subcategoria.url = CreateUrl.fnc(input.value);

            }

          })



      }


    }

  }


  /*=============================================
  Traer la data de subcategorías de acuerdo a la categoría seleccionada
  =============================================*/

  changeCategory(input) {

    // let category = input.value.split("_")[0];

    this.grupoService.getByFilter("categoria", input.value)
      .subscribe(resp => {
      
        this.grupos = [];
        let respuesta = resp;
        
        for (const i in resp) {
          
          this.grupos.push(resp[i]);
        }

        console.log("grupos:",this.grupos);

        // this.grupos.forEach(grupo=>{
        //   console.log("grupo:",grupo);
        // })
        // let grupos_finales = [];
        // for(const i in this.grupos){
        //   grupos_finales.push(this.grupos[i]);
        // }
        
      })

  }


  onSubmitProduct(f: NgForm) {
    console.log("f:", f);

    let formProduct = $(".formSubcategoria");

    for (let i = 0; i < formProduct.length; i++) {

      if ($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined) {

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }


    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;
    }
    this.subcategoria.vistas = 0;
    this.subcategoria.grupo = Capitalize.fnc(this.subcategoria.grupo);
    this.subcategoria.nombre = Capitalize.fnc(this.subcategoria.nombre);
    this.subcategoriaService.registerDatabase(this.subcategoria, localStorage.getItem('token_auth')).subscribe(resp => {
      Sweetalert.fnc("success",'Se ha registrado la subcategoría',null);
      this.bsModalRefAdd.hide();
      this.onClose.next(true);
    });

  }

}
