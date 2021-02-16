import { Component, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  es_vendedor:boolean = false;
  constructor(
    private userService:UsuarioService,
    private tiendaService:TiendaService
  ) { }

  ngOnInit(): void {
    this.userService.getFilterData("idToken",localStorage.getItem('idToken')).subscribe(resp=>{
      for(const i in resp){
        this.tiendaService.getFilterData('username',resp[i].username).subscribe(respTienda=>{
          if (Object.keys(respTienda).length > 0) {
            this.es_vendedor = true;
          }else{
            this.es_vendedor = false;
          }
        });
      }
    });
  }

}
