import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { Producto } from 'src/app/models/producto';
import { AprobacionModalComponent } from './aprobacion-modal/aprobacion-modal.component';

@Component({
  selector: 'app-aprobacion-productos',
  templateUrl: './aprobacion-productos.component.html',
  styleUrls: ['./aprobacion-productos.component.css']
})
export class AprobacionProductosComponent implements OnInit {
  productos:any[]=[];
  product : Producto;
  @ViewChild(MatSort) sort: MatSort;
  idProducts: any[] = [];
  public bsModalRefEdit: BsModalRef;
  displayedColumns: string[] = ['nro','nombre', 'tienda', 'feedback', 'fecha_creacion','acciones'];
  dataSource:MatTableDataSource<Producto>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  searchKey: string = "";
  constructor(
    private productoService: ProductoService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(){
    this.productoService.getAllAdmin().subscribe(resp=>{
      for(const i in resp){
        this.productos.push(resp[i]);
        this.idProducts = Object.keys(resp).toString().split(",");
      }
      this.productos.map((producto,index)=>{
        producto.feedback = JSON.parse(producto.feedback);
      });

      this.dataSource = new MatTableDataSource(this.productos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
      this.dataSource.sort = this.sort;
     
    })

  }


  editProduct(id:string ){
    const initialState = { producto_id: id };
    this.bsModalRefEdit = this.modalService.show(AprobacionModalComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    this.bsModalRefEdit.content.onClose.subscribe(resp=>{
      // console.log("respuest_modal:",resp);
      this.productos = [];
      this.getProductos();
    });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

}
