import { Component, OnInit, Input, OnDestroy } from '@angular/core';


import { DinamicPrice, Sweetalert } from '../../../functions';


import { Subject } from 'rxjs';

import notie from 'notie';
import { confirm } from 'notie';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { ProductoBreadcrumbComponent } from '../../producto/producto-breadcrumb/producto-breadcrumb.component';
import { ProductoService } from 'src/app/core/producto/producto.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-cuenta-wishlist',
  templateUrl: './cuenta-wishlist.component.html',
  styleUrls: ['./cuenta-wishlist.component.css']
})
export class CuentaWishlistComponent implements OnInit, OnDestroy {

	@Input() usuario_id:any;

	path:string = environment.url_image;
	wishlist:any[] = [];
	products:any[] = [];
	precio:any[] = [];
  render:boolean = true;

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

  popoverMessage:string = 'Esta seguro que desea eliminar el producto de su lista de deseos?';
  confirmText:string = 'Confirmar';
	constructor(private usersService: UsuarioService,
		        private productsService: ProductoService) { }

	ngOnInit(): void {

		/*=============================================
  	Agregamos opciones a DataTable
  	=============================================*/

  	this.dtOptions = {
  		pagingType: 'full_numbers',
  		// processing: true
  	}

  	/*=============================================
  	Seleccionamos el id del usuario
  	=============================================*/

		this.usersService.getById(this.usuario_id)
		.subscribe(resp=>{
			
			if(resp["wishlist"] != undefined){

				/*=============================================
    		Tomamos de la data la lista de deseos
  			=============================================*/

  			this.wishlist = JSON.parse(resp["wishlist"]);

  			let load = 0;
  			
  			/*=============================================
    		Realizamos un foreach en la lista de deseos
    		=============================================*/

    		if(this.wishlist.length > 0){

    			this.wishlist.forEach(list =>{	
    				
    				/*=============================================
        			Filtramos la data de productos 
    				=============================================*/

    				this.productsService.getByFilter("url", list)
    				.subscribe(resp=>{

              /*=============================================
              recorremos la data de productos
              =============================================*/

              for(const i in resp){

      					load++;

      					/*=============================================
          			agregamos los productos 
          			=============================================*/
      					
      					this.products.push(resp[i]);

      					/*=============================================
         			  validamos los precios en oferta
          			=============================================*/

          			this.precio.push(DinamicPrice.fnc(resp[i]))	

          			/*=============================================
            	  preguntamos cuando termina de cargar toda la data en el DOM
            	  =============================================*/

		        		if(load == this.wishlist.length){

		        			this.dtTrigger.next();
						
		        		}  

              }  
					
    				})
 
    			})		

    		}
	
			}

		})

	}

  /*=============================================
  Removemos el producto de la lista de deseos
  =============================================*/

  removeProduct(product){

    /*=============================================
    Buscamos coincidencia para remover el producto
    =============================================*/

    this.wishlist.forEach((list, index)=>{
      
      if(list == product){

        this.wishlist.splice(index, 1);

      }

    })

    /*=============================================
    Actualizamos en Firebase la lista de deseos
    =============================================*/

    let body ={

      wishlist: JSON.stringify(this.wishlist)
    
    }

    this.usersService.update(this.usuario_id, body)
    .subscribe(resp=>{

        if(resp["wishlist"] != ""){

          Sweetalert.fnc("success", "Producto removido", "cuenta-usuario/cuenta")

        }

    })

  }

  /*=============================================
  Callback
  =============================================*/
  callback(){

    if(this.render){

      this.render = false;

      if(window.matchMedia("(max-width:991px)").matches){   

        let localWishlist = this.wishlist;
        let localUsersService = this.usersService;
        let localChildItem = this.usuario_id;

        $(document).on("click", ".removeProduct", function(){

          let product = $(this).attr("remove");

          notie.confirm({

            text: "Are you sure to remove it?",
            cancelCallback: function(){
              return;
            },
            submitCallback: function(){

              /*=============================================
              Buscamos coincidencia para remover el producto
              =============================================*/

              localWishlist.forEach((list, index)=>{
                
                if(list == product){

                  localWishlist.splice(index, 1);

                }

              })

              /*=============================================
              Actualizamos en Firebase la lista de deseos
              =============================================*/

              let body ={

                wishlist: JSON.stringify(localWishlist)
              
              }

              localUsersService.update(localChildItem, body)
              .subscribe(resp=>{

                  if(resp["wishlist"] != ""){

                    Sweetalert.fnc("success", "Product removed", "cuenta-usuario/cuenta")

                  }

              })

            }

          })      

        })

      }
    
    }

  }

	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();

	}

}
