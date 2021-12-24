import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaEditComponent } from './categoria-edit/categoria-edit.component';
import { CategoriaModalComponent } from './categoria-modal/categoria-modal.component';
import { Sweetalert, Capitalize } from '../../functions';
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subcategoria } from 'src/app/models/subcategoria';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  subcategorias: any[] = [];
  loadProduct: number = 0;
  categorias: any[] = [];
  categoria: Categoria;
  public bsModalRefAdd: BsModalRef;
  displayedColumns: string[] = ['nro', 'nombre', 'grupo', 'url', 'vistas', 'acciones'];
  dataSource: MatTableDataSource<Categoria>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string = "";
  public bsModalRefEdit: BsModalRef;
  idCategorias: any[] = [];
  serverDelete: string = environment.serverDelete;
  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private modalService: BsModalService,
    private http: HttpClient,
    private subcategoriaService: SubcategoriaService,
    private productoService: ProductoService
  ) {
    this.categoria = new Categoria();
  }

  ngOnInit() {

    this.getCategorias();
  }


  getCategorias() {
    this.categoriaService.getAll().subscribe(resp => {
      // console.log("Respuesta:",resp);
      for (const i in resp) {
        this.categorias.push(resp[i]);
        this.idCategorias = Object.keys(resp).toString().split(",");
      }
      this.dataSource = new MatTableDataSource(this.categorias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
      this.dataSource.sort = this.sort;
      this.categorias.map((categoria, index) => {
        categoria.numero = index;
        categoria.grupo = JSON.parse(categoria.grupo);
      });

      console.log("categoria:", this.categorias);


    });
  }

  /*=============================================
 Editar Producto
 =============================================*/

  addCategoria() {
    this.bsModalRefAdd = this.modalService.show(CategoriaModalComponent, Object.assign({}, { class: 'modal-lg' }));
    this.bsModalRefAdd.content.onClose.subscribe(resp => {
      // console.log("respuest_modal:",resp);
      this.categorias = [];
      this.getCategorias();
    });

  }

  editCategoria(id: string) {

    const initialState = { categoria_id: id };
    this.bsModalRefEdit = this.modalService.show(CategoriaEditComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    this.bsModalRefEdit.content.onClose.subscribe(resp => {
      // console.log("respuest_modal:",resp);
      this.categorias = [];
      this.getCategorias();
    });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }



  deleteCategoria(i, categorias, id) {
    console.log("id:", i);
    Swal.fire({
      title: "Esta seguro que desea eliminar la categoría?",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      width: "46rem",
    }).then((willDelete) => {
      if (willDelete.value) {
        if (categorias.length > 1) {

          let allImages = [];
          let countDelete = 0;

          /*=============================================
          Borramos todos los archivos del servidor relacionados con el producto
          =============================================*/

          this.categorias.forEach((categoria, index) => {
            // console.log("index:",index);

            if (i == index) {
              allImages.push(

                `products/categorias/${categoria.url}`,

              )

              this.subcategoriaService.getByFilter('categoria', categoria.nombre).subscribe(respSubcate => {
                if (Object.keys(respSubcate).toString().length > 0) {
                  Sweetalert.fnc("error", "Existe registrada una subcategoría en esta categoría", null);
                  return;
                } else {

                  this.productoService.getByFilter('categoria', categoria.url).subscribe(respProducto => {
                    if (Object.keys(respProducto).toString().length > 0) {
                      Sweetalert.fnc("error", "Existe registrado un producto con esta categoría", null)
                      return;
                    } else {
                      for (const i in allImages) {

                        /*=============================================
                        Borrar todas las imagenes del servidor
                        =============================================*/

                        const formData = new FormData();

                        formData.append("directoryDelete", allImages[i]);

                        this.http.post(this.serverDelete, formData)
                          .subscribe(resp => {

                            if (resp["status"] == 200) {

                              countDelete++;

                              if (countDelete == allImages.length) {

                                this.subcategorias

                                this.categoriaService.deleteDataAuth(id, localStorage.getItem("idToken"))
                                  .subscribe(resp => {

                                    Sweetalert.fnc("success", "La categoría ha sido eliminada", null);
                                    this.getCategorias();
                                  }, err => {

                                    Sweetalert.fnc("error", err.error.error.message, null)

                                  })

                              }

                            }

                          })

                      }
                    }
                  });


                }
              });



            }

          })


        } else {

          Sweetalert.fnc("error", "No puedes eliminar el único producto", null)

        }

        // Sweetalert.fnc("success", "Se elimino el registro correctamente", null)
      } else {
        Swal.close();

      }
    });
  }



}
