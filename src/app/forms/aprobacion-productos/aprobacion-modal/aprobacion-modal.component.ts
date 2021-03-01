import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { Producto } from 'src/app/models/producto';
import { Sweetalert } from '../../../functions';

@Component({
  selector: 'app-aprobacion-modal',
  templateUrl: './aprobacion-modal.component.html',
  styleUrls: ['./aprobacion-modal.component.css']
})
export class AprobacionModalComponent implements OnInit {
  @Input() producto_id: string;
  producto:Producto;
  feedback : any [] = [];
  form: FormGroup;
  color: ThemePalette = 'accent';
  checked:boolean = false;
  type:any;
  // comment:any;
  public onClose: Subject<boolean>;
  constructor(
    private productsService: ProductoService,
    public bsModalRefEdit: BsModalRef,
    private formBuilder: FormBuilder,

  ) {
    this.producto = new Producto(); 
  }

  ngOnInit(): void {
    this.buildForm();
    this.editProduct();
    this.onClose = new Subject();
  }
  
  buildForm() {
    this.form = this.formBuilder.group({
      nombre: [''],
      tienda: [''],
      estado: [''],
      comentario:['']
    });
  }

  editProduct(){
    this.productsService.getById(this.producto_id).subscribe(resp=>{
      this.producto.nombre = resp['nombre'];
      this.producto.tienda = resp['tienda'];
      this.producto.fecha_creacion = resp['fecha_creacion'];
      this.producto.feedback = JSON.parse(resp['feedback']);

      this.producto.feedback.type == 'approved'?this.checked = true : this.checked = false;

      // this.feedback.push(JSON.parse(resp['feedback']));
      // this.feedback[0].type == 'approved'?this.checked = true:this.checked = false
      this.setValueForm();
      
    });
  }

  setValueForm() {
    this.form.setValue({
      nombre: this.producto.nombre,
      tienda: this.producto.tienda,
      estado: '',
      comentario: this.producto.feedback.comment,

     });
  }

  changeStatus(estado){
    
    if(!estado._checked){
      this.type = 'review';
      this.form.controls['comentario'].setValue('Tu producto esta en revisión');
    }else{
      this.type = 'approved';
      this.form.controls['comentario'].setValue('Tu producto ha sido aprobado');
    }
  }
  onSubmitProduct(event:Event){
    event.preventDefault();
    // const form = this.form.value;

    this.producto.feedback = {
      'type':this.type,
      'comment': this.form.controls['comentario'].value
    }
    this.producto.feedback = JSON.stringify(this.producto.feedback);

    this.productsService.patchDataAuth(this.producto_id,this.producto,localStorage.getItem('token_auth')).subscribe(resp=>{
      // console.log("resp:",resp);
      Sweetalert.fnc('success', 'El estado del producto ha sido actualizado', null);
      this.onClose.next(true);
      this.bsModalRefEdit.hide();
    })

  }

}
