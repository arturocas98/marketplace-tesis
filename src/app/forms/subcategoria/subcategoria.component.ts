import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  displayedColumns: string[] = ['nro','nombre', 'categoria', 'grupo', 'vistas','acciones'];
  dataSource:MatTableDataSource<Subcategoria>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string = "";
  constructor(
    private fb: FormBuilder,
    private subcategoriaService: SubcategoriaService,
    private categoriaService : CategoriaService,
    private modalService: BsModalService,  
  ) {
    this.subcategoria = new Subcategoria();
  }

  ngOnInit(){
    this.getSubcategorias();
  }

  getSubcategorias(){
    this.subcategoriaService.getAll().subscribe(resp=>{
      // console.log("Respuesta:",resp);
      for(const i in resp){
        this.subcategorias.push(resp[i]);

      }
      this.dataSource = new MatTableDataSource(this.subcategorias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
      this.dataSource.sort = this.sort;
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

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
