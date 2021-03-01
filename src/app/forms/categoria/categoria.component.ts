import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaModalComponent } from './categoria-modal/categoria-modal.component';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {
  subcategorias: any[] =[];
  loadProduct : number = 0;
  categorias : any [] = [];
  categoria: Categoria;
  public bsModalRefAdd: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private categoriaService : CategoriaService,
    private modalService: BsModalService,  
  ) {
    this.categoria = new Categoria();
  }

  ngOnInit(){

    this.getCategorias();
  }

  getCategorias(){
    this.categoriaService.getAll().subscribe(resp=>{
      // console.log("Respuesta:",resp);
      for(const i in resp){
        this.categorias.push(resp[i]);
      }
      this.categorias.map(categoria=>{
        categoria.grupo = JSON.parse(categoria.grupo);
      });
    });
  }

   /*=============================================
  Editar Producto
  =============================================*/

  addCategoria() {
    this.bsModalRefAdd = this.modalService.show(CategoriaModalComponent, Object.assign({}, { class: 'modal-lg' }));
    this.bsModalRefAdd.content.onClose.subscribe(resp=>{
      // console.log("respuest_modal:",resp);
      this.categorias = [];
      this.getCategorias();
    });
    
  }

}
