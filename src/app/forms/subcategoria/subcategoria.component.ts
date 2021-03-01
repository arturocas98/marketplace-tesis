import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { Subcategoria } from 'src/app/models/subcategoria';
import { SubcategoriaModalAddComponent } from './subcategoria-modal-add/subcategoria-modal-add.component';

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})
export class SubcategoriaComponent  implements OnInit,OnDestroy{
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  subcategorias: any[] =[];
  loadProduct : number = 0;
  categorias : any [] = [];
  subcategoria: Subcategoria;
  public bsModalRefAdd: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private subcategoriaService: SubcategoriaService,
    private categoriaService : CategoriaService,
    private modalService: BsModalService,  
  ) {
    this.subcategoria = new Subcategoria();
  }

  ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    }
    this.getSubcategorias();
    // this.getCategorias();
  }

  getCategorias(){
    this.categoriaService.getAll().subscribe(resp=>{
      // console.log("Respuesta:",resp);
      for(const i in resp){
        this.categorias.push(resp[i]);

      }
    });
  }

  getSubcategorias(){
    this.subcategoriaService.getAll().subscribe(resp=>{
      // console.log("Respuesta:",resp);
      for(const i in resp){
        this.subcategorias.push(resp[i]);

      }
      if (this.loadProduct == this.subcategorias.length) {
        this.dtTrigger.next();
      }
    });
  }

  onSubmit(input) {
    // this.productModel.categoria = this.productModel.categoria.split("_")[1];
  }

  validate(input){

  }

   /*=============================================
  Editar Producto
  =============================================*/

  addSubcategoria() {
    this.bsModalRefAdd = this.modalService.show(SubcategoriaModalAddComponent, Object.assign({}, { class: 'modal-lg' }));
    this.bsModalRefAdd.content.onClose.subscribe(resp=>{
      this.subcategorias = [];
      this.getSubcategorias();
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
