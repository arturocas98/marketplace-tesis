import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
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
  displayedColumns :string[]= ['producto','tienda','estado','actions'];
  @ViewChild(MatSort) sort: MatSort;
  idProducts: any[] = [];
  public bsModalRefEdit: BsModalRef;
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

}
